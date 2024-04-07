function updateTitles() {
  console.log('Attempting to update game titles...');
  // Disable the update button
  document.getElementById('updateButton').disabled = true;
  fetch('/update-titles', {
    method: 'POST'
  }).then(response => {
    if (response.ok) {
      console.log('Response received. Parsing...');
      return response.json();
    }
    throw new Error('Network response was not ok.');
  }).then(data => {
    console.log('Update successful:', data);
    alert('Game titles updated successfully!');
    // Update progress to 100% on successful update
    document.getElementById('progressBar').style.width = '100%';
    document.getElementById('progressBar').setAttribute('aria-valuenow', 100);
  }).catch(error => {
    console.error('Failed to update game titles:', error);
    alert('Failed to update game titles. Please try again.');
  }).finally(() => {
    // Re-enable the update button
    document.getElementById('updateButton').disabled = false;
  });
}

// New function to simulate real-time progress updates
function simulateProgressUpdate() {
  let progress = 0;
  const progressBar = document.getElementById('progressBar');
  const interval = setInterval(() => {
    progress += 10;
    progressBar.style.width = `${progress}%`;
    progressBar.setAttribute('aria-valuenow', progress);
    if (progress >= 100) {
      clearInterval(interval);
    }
  }, 1000);
}

// Function to toggle the description expansion
function toggleDescription(element) {
  if (element.classList.contains('expanded')) {
    element.classList.remove('expanded');
  } else {
    element.classList.add('expanded');
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // Attach event listeners to all description elements for toggling expansion
  const descriptions = document.querySelectorAll('.description');
  descriptions.forEach(description => {
    description.addEventListener('click', () => toggleDescription(description));
  });
});