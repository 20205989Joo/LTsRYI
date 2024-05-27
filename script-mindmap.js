document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('mindmap');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvasContainer');
    const footer = document.querySelector('footer');
    let nodes = [];
    let edges = [];
    let isDragging = false;
    let wasDragging = false;
    let dragNodeIndex = null;
    let offsetX, offsetY;

    class Node {
        constructor(x, y, text = '', parent = null, isCentral = false, isHint = false) {
            this.x = x;
            this.y = y;
            this.text = text;
            this.parent = parent;
            this.isCentral = isCentral;
            this.isHint = isHint;
            this.level = this.calculateLevel();
            this.id = this.generateId();
            this.element = this.createElement();
            container.appendChild(this.element);
            this.updateSize(this.element);
        }

        calculateLevel() {
            if (this.isCentral) return 0;
            let level = 0;
            let current = this;
            while (current.parent) {
                level++;
                current = current.parent;
            }
            return level;
        }

        generateId() {
            return 'node-' + Math.random().toString(36).substr(2, 9);
        }

        createElement() {
            const nodeElement = document.createElement('div');
            nodeElement.classList.add('node');
            nodeElement.classList.add(`level-${this.level}`);
            if (this.isHint) {
                nodeElement.classList.add('hint');
            }
            nodeElement.style.left = `${this.x}px`;
            nodeElement.style.top = `${this.y}px`;
            nodeElement.setAttribute('data-id', this.id);
            nodeElement.innerHTML = `
                <div class="node-text" contenteditable="false">${this.text}</div>
                <div class="node-controls">
                    <button class="button add">추가</button>
                    ${!this.isCentral ? '<button class="button delete">삭제</button>' : ''}
                </div>
            `;

            const textElement = nodeElement.querySelector('.node-text');
            textElement.addEventListener('input', (e) => {
                this.text = textElement.textContent;
                this.updateSize(nodeElement);
                drawAll();
            });

            nodeElement.querySelector('.add').addEventListener('click', (e) => {
                e.stopPropagation();
                const angle = Math.random() * 2 * Math.PI;
                const distance = 100;
                const newX = Math.min(Math.max(this.x + distance * Math.cos(angle), 0), canvas.width - nodeElement.offsetWidth);
                const newY = Math.min(Math.max(this.y + distance * Math.sin(angle), 0), canvas.height - nodeElement.offsetHeight - footer.offsetHeight);
                const newNode = new Node(newX, newY, 'IDEA +', this);
                nodes.push(newNode);
                edges.push({ from: this, to: newNode });
                drawAll();
            });

            if (!this.isCentral) {
                nodeElement.querySelector('.delete').addEventListener('click', (e) => {
                    e.stopPropagation();
                    nodes = nodes.filter(node => node !== this);
                    edges = edges.filter(edge => edge.from !== this && edge.to !== this);
                    container.removeChild(nodeElement);
                    drawAll();
                });

                nodeElement.addEventListener('mousedown', (e) => {
                    if (!e.target.matches('.node-text, button')) {
                        isDragging = true;
                        wasDragging = false;
                        dragNodeIndex = nodes.indexOf(this);
                        offsetX = e.clientX - nodeElement.offsetLeft;
                        offsetY = e.clientY - nodeElement.offsetTop;
                        document.addEventListener('mousemove', moveNode);
                        document.addEventListener('mouseup', stopDragging);
                    }
                });
            }

            nodeElement.addEventListener('click', (e) => {
                if (!wasDragging && !e.target.matches('.button')) {
                    e.stopPropagation();
                    this.toggleEditMode(nodeElement, true);
                }
            });

            const moveNode = (e) => {
                if (isDragging) {
                    wasDragging = true;
                    this.x = Math.min(Math.max(e.clientX - offsetX, 0), canvas.width - nodeElement.offsetWidth);
                    this.y = Math.min(Math.max(e.clientY - offsetY, 0), canvas.height - nodeElement.offsetHeight - footer.offsetHeight);
                    nodeElement.style.left = `${this.x}px`;
                    nodeElement.style.top = `${this.y}px`;
                    drawAll();
                }
            };

            const stopDragging = () => {
                document.removeEventListener('mousemove', moveNode);
                document.removeEventListener('mouseup', stopDragging);
                isDragging = false;
                setTimeout(() => {
                    wasDragging = false;
                }, 0);
            };

            return nodeElement;
        }

        toggleEditMode(nodeElement, state) {
            const textElement = nodeElement.querySelector('.node-text');
            const controls = nodeElement.querySelector('.node-controls');
            if (state) {
                nodeElement.classList.add('editing');
                textElement.setAttribute('contenteditable', 'true');
                textElement.style.pointerEvents = 'auto';
                controls.style.display = 'flex';
                textElement.focus();
                if (this.isHint && textElement.textContent === "(눌러서 나의 경험도 써보자)") {
                    textElement.textContent = "";
                }
            } else {
                nodeElement.classList.remove('editing');
                textElement.setAttribute('contenteditable', 'false');
                textElement.style.pointerEvents = 'none';
                controls.style.display = 'none';
                if (this.isHint && textElement.textContent.trim() === "") {
                    textElement.textContent = "(눌러서 나의 경험도 써보자)";
                }
            }
        }

        updateSize(nodeElement) {
            const textElement = nodeElement.querySelector('.node-text');
            const width = Math.max(textElement.textContent.length * 10 + 20, 100); // 최소 너비 100px로 설정
            nodeElement.style.width = `${width}px`;
        }

        drawLine() {
            if (this.parent) {
                ctx.beginPath();
                ctx.moveTo(this.parent.x + this.parent.element.offsetWidth / 2, this.parent.y + this.parent.element.offsetHeight / 2);
                ctx.lineTo(this.x + this.element.offsetWidth / 2, this.y + this.element.offsetHeight / 2);
                ctx.stroke();
            }
        }
    }

    function drawAll() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        edges.forEach(edge => {
            edge.from.drawLine.call(edge.to);
        });
    }

    function initialize() {
        const centerX = canvas.width / 2 - 40;
        const centerY = canvas.height / 2 - 40;
        const centralNode = new Node(centerX, centerY, 'MIND MAP', null, true);
        nodes.push(centralNode);
        drawAll();
    }

    function adjustNodePositions() {
        const scaleX = container.clientWidth / canvas.width;
        const scaleY = container.clientHeight / canvas.height;

        nodes.forEach(node => {
            node.x *= scaleX;
            node.y *= scaleY;
            node.element.style.left = `${node.x}px`;
            node.element.style.top = `${node.y}px`;
        });

        canvas.width = container.clientWidth;
        canvas.height = container.clientHeight;
        drawAll();
    }

    initialize();
    adjustNodePositions();

    window.addEventListener('resize', () => {
        adjustNodePositions();
    });

    window.addEventListener('click', () => {
        nodes.forEach(node => node.toggleEditMode(node.element, false));
    });

    window.initializeMindmap = function(keywords) {
        const centralNode = nodes.find(node => node.isCentral);
        if (!centralNode) return;

        const centerX = centralNode.x;
        const centerY = centralNode.y;
        const radius = 160; // 거리 설정
        const angleStep = (2 * Math.PI) / keywords.length;

        keywords.forEach((keyword, index) => {
            const angle = index * angleStep;
            const x = Math.min(Math.max(centerX + radius * Math.cos(angle), 0), canvas.width - 100);
            const y = Math.min(Math.max(centerY + radius * Math.sin(angle), 0), canvas.height - 40 - footer.offsetHeight);
            const newNode = new Node(x, y, keyword, centralNode);
            newNode.level = 1; // 레벨 1로 설정
            nodes.push(newNode);
            edges.push({ from: centralNode, to: newNode });
        });

        drawAll();
    };

    window.importAndAddKeywords = function(data) {
        data.forEach(({ keyword, input }) => {
            const parentNode = nodes.find(node => node.text.includes(keyword) && node.level === 1);
            if (parentNode) {
                const childNodes = nodes.filter(node => node.parent === parentNode && node.level === 2);

                // 노드0과 노드1의 각도를 계산
                const centralNode = nodes.find(node => node.isCentral);
                if (centralNode) {
                    const angleToParent = Math.atan2(parentNode.y - centralNode.y, parentNode.x - centralNode.x);
                    const distance = 150; // 노드 간의 기본 거리
                    const minDistance = 50; // 노드끼리의 최소 거리

                    // 노드2를 노드1의 외부에 생성
                    let newX, newY;
                    let collision;
                    do {
                        collision = false;
                        const offsetAngle = (Math.random() - 0.5) * Math.PI / 6; // 무작위 각도 오프셋
                        newX = Math.min(Math.max(parentNode.x + distance * Math.cos(angleToParent + offsetAngle), 0), canvas.width - 100);
                        newY = Math.min(Math.max(parentNode.y + distance * Math.sin(angleToParent + offsetAngle), 0), canvas.height - 40 - footer.offsetHeight);

                        // 충돌 검사
                        for (const node of nodes) {
                            if (node.level === 2) {
                                const dx = newX - node.x;
                                const dy = newY - node.y;
                                const dist = Math.sqrt(dx * dx + dy * dy);
                                if (dist < minDistance) {
                                    collision = true;
                                    break;
                                }
                            }
                        }
                    } while (collision);

                    // 새로운 노드 추가
                    const newNode = new Node(newX, newY, input, parentNode);
                    newNode.level = 2; // 올바른 레벨 설정
                    nodes.push(newNode);
                    edges.push({ from: parentNode, to: newNode });

                    // 힌트 노드 추가 (자식 노드가 없을 때만)
                    if (childNodes.length === 0) {
                        const hintOffsetAngle = Math.PI / 6; // 힌트 노드에 대한 각도 오프셋
                        const hintX = Math.min(Math.max(parentNode.x + distance * Math.cos(angleToParent + hintOffsetAngle), 0), canvas.width - 100);
                        const hintY = Math.min(Math.max(parentNode.y + distance * Math.sin(angleToParent + hintOffsetAngle), 0), canvas.height - 40 - footer.offsetHeight);
                        const hintNode = new Node(hintX, hintY, '(눌러서 나의 경험도 써보자)', parentNode, false, true);
                        hintNode.level = 2; // 레벨 2로 설정
                        nodes.push(hintNode);
                        edges.push({ from: parentNode, to: hintNode });
                    }
                }
            }
        });
        drawAll();
    };

    async function saveMindmap() {
        const params = new URLSearchParams(window.location.search);
        const userId = params.get('id');
        const QLevel = params.get('grade');
        const QYear = params.get('year');
        const QMonth = params.get('month');
        const QNo = params.get('number');
        const whichHW = 'mindmap';
    
        if (!userId || !QLevel || !QYear || !QMonth || !QNo) {
            alert('필요한 정보가 모두 제공되지 않았습니다.');
            return;
        }
    
        html2canvas(document.getElementById('canvasContainer')).then(function(canvas) {
            canvas.toBlob(function(blob) {
                const formData = new FormData();
                formData.append('UserId', userId);
                formData.append('QLevel', QLevel);
                formData.append('QYear', QYear);
                formData.append('QMonth', QMonth);
                formData.append('QNo', QNo);
                formData.append('whichHW', whichHW);
                formData.append('HWImage', blob);
    
                fetch('https://port-0-ltryi-database-1ru12mlw3glz2u.sel5.cloudtype.app/api/saveHWImages', {
                    method: 'POST',
                    body: formData
                }).then(response => {
                    if (response.ok) {
                        alert('Mindmap saved successfully!');
                    } else {
                        response.text().then(text => {
                            alert('Failed to save mindmap: ' + text);
                        });
                    }
                }).catch(error => {
                    console.error('Error:', error);
                    alert('An error occurred while saving the mindmap.');
                });
            }, 'image/png');
        });
    }

    window.saveMindmap = saveMindmap;
});
