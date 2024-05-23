document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('mindmap');
    const ctx = canvas.getContext('2d');
    const container = document.getElementById('canvasContainer');
    let nodes = [];
    let edges = [];
    let isDragging = false;
    let wasDragging = false;
    let dragNodeIndex = null;
    let offsetX, offsetY;

    class Node {
        constructor(x, y, text = '', parent = null, isCentral = false) {
            this.x = x;
            this.y = y;
            this.text = text;
            this.parent = parent;
            this.isCentral = isCentral;
            this.id = this.generateId();
            this.element = this.createElement();
            container.appendChild(this.element);
        }

        generateId() {
            return 'node-' + Math.random().toString(36).substr(2, 9);
        }

        createElement() {
            const nodeElement = document.createElement('div');
            nodeElement.classList.add('node');
            nodeElement.style.left = `${this.x}px`;
            nodeElement.style.top = `${this.y}px`;
            nodeElement.setAttribute('data-id', this.id);
            nodeElement.innerHTML = `
                <div class="node-text">${this.text}</div>
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
                const newX = this.x + distance * Math.cos(angle);
                const newY = this.y + distance * Math.sin(angle);
                const newNode = new Node(newX, newY, '새 노드', this);
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
                    this.x = e.clientX - offsetX;
                    this.y = e.clientY - offsetY;
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
            } else {
                nodeElement.classList.remove('editing');
                textElement.removeAttribute('contenteditable');
                textElement.style.pointerEvents = 'none';
                controls.style.display = 'none';
            }
        }

        updateSize(nodeElement) {
            const textElement = nodeElement.querySelector('.node-text');
            const width = Math.max(textElement.textContent.length * 10 + 20, 80); // 최소 너비 80px로 설정
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

    initialize();

    window.addEventListener('click', () => {
        nodes.forEach(node => node.toggleEditMode(node.element, false));
    });
});
