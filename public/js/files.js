function loadFiles() {
    const folderPath = document.getElementById('folder-path').value;
    // Make an API call to the server to fetch the list of files in the specified folder
    // Update the file-list div with the received file data
    // Example file data:
    const files = [
      { name: 'file1.txt', date: '2023-06-08', size: '10KB' },
      { name: 'file2.jpg', date: '2023-06-07', size: '500KB' },
      { name: 'file3.pdf', date: '2023-06-06', size: '1MB' }
    ];
    displayFiles(files);
  }
  
function displayFiles(files) {
    const fileList = document.getElementById('file-list');
    fileList.innerHTML = '';
    files.forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';
      fileItem.innerHTML = `
        <div class="file-name">${file.name}</div>
        <div class="file-date">${file.date}</div>
        <div class="file-size">${file.size}</div>
        <a href="#" class="view-link" onclick="viewFile('${file.name}')">View</a>
      `;
      fileList.appendChild(fileItem);
    });
}

function sortFiles() {
    const sortBy = document.getElementById('sort-by').value;
    // Make an API call to the server to fetch the sorted list of files based on the selected criteria
    // Update the file-list div with the sorted file data
    // Example sorted file data:
    const sortedFiles = [
      { name: 'file1.txt', date: '2023-06-08', size: '10KB' },
      { name: 'file3.pdf', date: '2023-06-06', size: '1MB' },
      { name: 'file2.jpg', date: '2023-06-07', size: '500KB' }
    ];
    displayFiles(sortedFiles);
 }

function viewFile(fileName) {
    // Make an API call to the server to fetch the details of the selected file
    // Display the file details in a modal or a separate page
    console.log('View file:', fileName);
}