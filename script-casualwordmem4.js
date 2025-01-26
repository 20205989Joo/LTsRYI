// Select the elements for animation
const bosangBox = document.querySelector('.BosangBox');
const lucinReward = document.querySelector('.lucin_reward');
const thumbTuer = document.querySelector('.thumb_tuer');
const labelTuerName = document.querySelector('#label_tuer_name');
const labelTuerHowmuch = document.querySelector('#label_tuer_howmuch');
const getRewardButton = document.querySelector('.gettodazebutton');

// Function to animate the BosangBox
function showBosangBox() {
    // Initial hidden state for BosangBox
    bosangBox.style.opacity = '0';
    bosangBox.style.transition = 'opacity 0.3s ease';

    // Trigger BosangBox fade-in
    setTimeout(() => {
        bosangBox.style.opacity = '1';
    }, 10);

    // Animate lucinReward with scale and multiple bounces
    setTimeout(() => {
        lucinReward.style.transform = 'scale(0.8)';
        lucinReward.style.transition = 'transform 0.2s ease';
        setTimeout(() => {
            lucinReward.style.transform = 'scale(1.2)';
            lucinReward.style.transition = 'transform 0.2s ease';
            setTimeout(() => {
                lucinReward.style.transform = 'scale(1) translateY(-15px)';
                lucinReward.style.transition = 'transform 0.1s ease';
                setTimeout(() => {
                    lucinReward.style.transform = 'scale(1) translateY(5px)';
                    lucinReward.style.transition = 'transform 0.1s ease';
                    setTimeout(() => {
                        lucinReward.style.transform = 'scale(1) translateY(-10px)';
                        lucinReward.style.transition = 'transform 0.1s ease';
                        setTimeout(() => {
                            lucinReward.style.transform = 'scale(1) translateY(0)';
                        }, 100);
                    }, 100);
                }, 100);
            }, 200);
        }, 200);
    }, 300);

    // Animate thumbTuer and labelTuerName with fade-in
    setTimeout(() => {
        thumbTuer.style.opacity = '0';
        thumbTuer.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        thumbTuer.style.transform = 'translateY(20px)'; // Start below

        labelTuerName.style.opacity = '0';
        labelTuerName.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        labelTuerName.style.transform = 'translateY(20px)'; // Start below

        setTimeout(() => {
            thumbTuer.style.opacity = '1';
            thumbTuer.style.transform = 'translateY(0)'; // Move to original position

            labelTuerName.style.opacity = '1';
            labelTuerName.style.transform = 'translateY(0)'; // Move to original position
        }, 100);
    }, 1000); // Delay to start after lucinReward animation

    // Animate labelTuerHowmuch separately with scale, fade-in, and upward movement
    setTimeout(() => {
        labelTuerHowmuch.style.opacity = '0';
        labelTuerHowmuch.style.transform = 'scale(0.8) translateY(20px)'; // Start below
        labelTuerHowmuch.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

        setTimeout(() => {
            labelTuerHowmuch.style.opacity = '1';
            labelTuerHowmuch.style.transform = 'scale(1) translateY(0)'; // Move to original position

            // Activate the getReward button after additional delay
            setTimeout(() => {
                getRewardButton.style.opacity = '1';
                getRewardButton.style.cursor = 'pointer';
            }, 800); // Additional delay for button activation
        }, 300); // Delay specific to labelTuerHowmuch
    }, 1300); // Separate delay for labelTuerHowmuch animation
}

// Add click event listener to 'gettodazebutton' button
if (getRewardButton) {
    getRewardButton.addEventListener('click', () => {
        window.location.href = 'inventory.html'; // Redirect to inventory.html
    });
}

// Trigger the animation on page load
document.addEventListener('DOMContentLoaded', showBosangBox);
