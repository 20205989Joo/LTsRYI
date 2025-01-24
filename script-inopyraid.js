document.addEventListener('DOMContentLoaded', () => {
    const bossRaidButton = document.querySelector('.enterbutton_boss_raid');

    if (bossRaidButton) {
        bossRaidButton.addEventListener('click', () => {
            window.location.href = 'inopyraid_entry.html';
        });
    }
});