function updateTitles() {
  console.log('Attempting to update titles...');
  // Disable the update button
  document.getElementById('updateDatabaseButton').disabled = true;

  // Initialize progress for each category
  const gamesProgressBar = document.getElementById('gamesProgress');

  gamesProgressBar.style.width = '0%';

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
  }).catch(error => {
    console.error('Failed to update game titles:', error);
    alert('Failed to update game titles. Please try again.');
  }).finally(() => {
    // Re-enable the update button
    document.getElementById('updateDatabaseButton').disabled = false;
  });
}

function updateVersions() {
  console.log('Attempting to update game versions...');
  // Disable the update button
  document.getElementById('updateVersionsButton').disabled = true;

  fetch('/update-versions', {
    method: 'POST'
  }).then(response => {
    if (response.ok) {
      console.log('Response received. Parsing...');
      return response.json();
    }
    throw new Error('Network response was not ok.');
  }).then(data => {
    console.log('Update successful:', data);
  }).catch(error => {
    console.error('Failed to update game versions:', error);
    alert('Failed to update game versions. Please try again.');
  }).finally(() => {
    // Re-enable the update button
    document.getElementById('updateVersionsButton').disabled = false;
  });
}

function formatBytes(value) {
  const kilo = 1024;
  const mega = kilo ** 2;
  const giga = kilo ** 3;

  if (value < kilo) {
    return value + " B";
  } else if (value < mega) {
    return (value / kilo).toFixed(2) + " KB";
  } else if (value < giga) {
    return (value / mega).toFixed(2) + " MB";
  } else {
    return (value / giga).toFixed(2) + " GB";
  }
}


document.addEventListener('DOMContentLoaded', () => {
  // Initialize progress bar variables
  const gamesProgressBar = document.getElementById('gamesProgress');
  // Attach event listeners to all description elements for toggling expansion
  const descriptions = document.querySelectorAll('.description');
  descriptions.forEach(description => {
    description.addEventListener('click', () => toggleDescription(description));
  });

  
  // Attach event listener to the update button for manual database update
  const updateButton = document.getElementById('updateDatabaseButton');
  if (updateButton) {
    updateButton.addEventListener('click', () => {
      updateVersions();
      // Start polling for progress updates for each category
      const intervalId = setInterval(() => {
        fetch('/update-progress')
        .then(response => response.json())
        .then(data => {
            // Update progress bars based on the fetched data
            gamesProgressBar.style.width = data.games + '%';
            gamesProgressBar.setAttribute('aria-valuenow', data.games);
            gamesProgressBar.textContent = 'Games ' + data.games + '%';

            if(data.games >= 100) {
                clearInterval(intervalId);
            }
        })
        .catch(error => {
            console.error('Error fetching update progress:', error);
            clearInterval(intervalId);
            alert('Error fetching update progress. Please check the console for more details.');
        });
      }, 1000);
    });
  }


  // Format game sizes
  const sizeElements = document.querySelectorAll('[data-size]');
  sizeElements.forEach(element => {
    const size = element.getAttribute('data-size');
    element.textContent = formatBytes(parseInt(size, 10));
  });
});