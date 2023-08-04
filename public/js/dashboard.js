




function showTab(tabName) {
    // Hide all tab contents
    var allContents = document.querySelectorAll('.admin-content');
    allContents.forEach(function (content) {
      content.classList.add('d-none');
    });

    // Show the selected tab content
    var selectedContent = document.getElementById(tabName + 'Content');
    selectedContent.classList.remove('d-none');

    // Update active tab styling
    var allTabs = document.querySelectorAll('.tab-item');
    allTabs.forEach(function (tab) {
      tab.classList.remove('active');
    });

    // Add active class to the clicked tab
    var clickedTab = document.querySelector('[onclick="showTab(\'' + tabName + '\')"]');
    clickedTab.classList.add('active');
  }