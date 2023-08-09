const inputData = [
    {
      user_id: 1,
      bill_id: "INW080CC3",
      meter_num: 3683502,
      bill_generated_date: "2021-01-05",
      bill_due_date: "2021-04-05",
      consumption_units: 740,
      amount_due: 500,
      paid_status: 1,
      paid_date: "2021-04-01",
    },
    {
      user_id: 1,
      bill_id: "INW080CC3",
      meter_num: 3683502,
      bill_generated_date: "2021-01-05",
      bill_due_date: "2021-03-05",
      consumption_units: 740,
      amount_due: 500,
      paid_status: 1,
      paid_date: "2021-03-01",
    },
    {
      user_id: 1,
      bill_id: "INW080CC3",
      meter_num: 3683502,
      bill_generated_date: "2021-01-05",
      bill_due_date: "2021-02-05",
      consumption_units: 740,
      amount_due: 500,
      paid_status: 0,
      paid_date: "not paid",
    },
    {
      user_id: 1,
      bill_id: "INW080CC3",
      meter_num: 3683502,
      bill_generated_date: "2021-03-05",
      bill_due_date: "2021-04-05",
      consumption_units: 740,
      amount_due: 500,
      paid_status: 0,
      paid_date: "not paid",
    },
    {
      user_id: 2,
      bill_id: "IN5CTSNWP",
      meter_num: 3683502,
      bill_generated_date: "2021-02-05",
      bill_due_date: "2021-06-05",
      consumption_units: 853,
      amount_due: 100,
      paid_status: 0,
      paid_date: "not paid",
    },
    {
      user_id: 2,
      bill_id: "IN5CTSNWP",
      meter_num: 3683502,
      bill_generated_date: "2021-02-05",
      bill_due_date: "2021-05-05",
      consumption_units: 853,
      amount_due: 100,
      paid_status: 0,
      paid_date: "not paid",
    },
    {
      user_id: 2,
      bill_id: "IN5CTSNWP",
      meter_num: 3683502,
      bill_generated_date: "2021-02-05",
      bill_due_date: "2021-05-05",
      consumption_units: 853,
      amount_due: 100,
      paid_status: 0,
      paid_date: "not paid",
    },
    {
      user_id: 3,
      bill_id: "INQ5AS5VW",
      meter_num: 3683502,
      bill_generated_date: "2022-02-05",
      bill_due_date: "2022-05-05",
      consumption_units: 885,
      amount_due: 100,
      paid_status: 0,
      paid_date: "not paid",
    },
    {
      user_id: 3,
      bill_id: "INQ5AS5VW",
      meter_num: 3683502,
      bill_generated_date: "2022-02-05",
      bill_due_date: "2022-05-05",
      consumption_units: 885,
      amount_due: 6770.25,
      paid_status: 1,
      paid_date: "2022-05-10",
    },
    {
      user_id: 4,
      bill_id: "IN4B36BQ7",
      meter_num: 3683502,
      bill_generated_date: "2022-03-05",
      bill_due_date: "2022-06-05",
      consumption_units: 719,
      amount_due: 5500.35,
      paid_status: 0,
      paid_date: "not paid",
    },
    {
      user_id: 5,
      bill_id: "INJ26S4W3",
      meter_num: 3683502,
      bill_generated_date: "2022-04-05",
      bill_due_date: "2022-07-05",
      consumption_units: 383,
      amount_due: 2929.95,
      paid_status: 1,
      paid_date: "2022-07-05",
    },
    {
      user_id: 6,
      bill_id: "IN8ONBVH7",
      meter_num: 51106093,
      bill_generated_date: "2022-10-05",
      bill_due_date: "2023-01-05",
      consumption_units: 452,
      amount_due: 3457.8,
      paid_status: 1,
      paid_date: "2023-01-05",
    },
    // Add more sample data as needed
  ];

//---------------------------------------------------------------------------------------------------
  
  document.addEventListener('DOMContentLoaded', event =>{
    console.log('hi im woriking')
    const session = sessionStorage.getItem('sid')

    $.post('/billDetails',
    {
        session : session
    },
    (data)=>{
        const result = separateData(data.info);
        printData(result,data.user, data.admin_id)
    })

  })

  function printData(data, userData, admin_id) {
    const admin = document.getElementById('adminUser');
    const fadmin = document.getElementById('foot-admin');
  
    let paidTable, notPaidTable, moreThan3Table;
  
    for (let user of userData) {
      if (user.user_id == admin_id) {
        admin.innerHTML = '<li><a class="" href="#!">Name : '+user.user_name+'</a></li><li><a class="" href="#!">Phone : '+user.user_phone+'</a></li>';
        fadmin.innerHTML = '<div class="small">Logged In as  </div>' + user.user_name + '';
        break;
      }
    }
  
    const dataTableOptions = {
      searchable: true,
      sortable: true,
      perPage: 10,
      perPageSelect: [5, 10, 20, 50],
    };
  
    const paidData = [];
    const notPaidData = [];
    const moreThan3Data = [];
  
    for (const user of data.uniquePaidUsers) {
      let users;
      for (let i of userData) {
        if (i.user_id == user.user_id) {
          users = i;
          break;
        }
      }
      paidData.push([users.user_name, users.user_id, user.paidAmount, users.user_phone, user.bill_generated_date, user.latestPaidDate, '<button class="info-button" onClick="userInfo('+users.user_id+')">Info</button>']);
    }
  
    for (const user of data.notPaidLessThan3Months) {
      let users;
      for (let i of userData) {
        if (i.user_id == user.user_id) {
          users = i;
          break;
        }
      }
      notPaidData.push([users.user_name, users.user_id, user.totalBalance, users.user_phone, user.bill_generated_date, user.dueDate, '<button class="info-button" onClick="userInfo('+users.user_id+')">Info</button>']);
    }
  
    for (const user of data.notPaidMoreThan3Months) {
      let users;
      for (let i of userData) {
        if (i.user_id == user.user_id) {
          users = i;
          break;
        }
      }
      moreThan3Data.push([users.user_name,users.user_id, user.totalBalance, users.user_phone, user.bill_generated_date, user.dueDate, '<button class="info-button" style="background-color:red;">Disable</button>']);
    }
  
    paidTable = $('#datatablesSimple').DataTable(dataTableOptions);
    paidTable.clear().rows.add(paidData).draw();
  
     notPaidTable = $('#datatablesSimple1').DataTable(dataTableOptions);
    notPaidTable.clear().rows.add(notPaidData).draw();
  
     moreThan3Table = $('#datatablesSimple2').DataTable(dataTableOptions);
    moreThan3Table.clear().rows.add(moreThan3Data).draw();

  }


  //==============================================================================

  function separateData(inputData) {
    const groupedData = {};
  
    for (let bill of inputData) {
      if (!groupedData[bill.user_id]) {
        groupedData[bill.user_id] = [];
      }
      groupedData[bill.user_id].push(bill);
    }
  
    const uniqueData = [];
    const notPaidLessThan3Months = [];
    const notPaidMoreThan3Months = [];
    for (const userId in groupedData) {
  
      const bills = groupedData[userId];
      const allPaid = bills.every((bill) => bill.paid_status === 1);
      const unpaidMonths = bills.filter((bill) => bill.paid_status === 0).length; 
  
      if (allPaid) {
        const latestPaidDate = bills.reduce((latestDate, bill) => {
          return bill.paid_status === 1 && bill.paid_date > latestDate
            ? bill.paid_date
            : latestDate;
        }, bills[0].paid_date);
  
        const paidAmount = bills.reduce((amount,bill)=>{
          return latestPaidDate == bill.paid_date
             ? amount+bill.amount_due 
             : amount;
        },0)
  
        uniqueData.push({ ...bills[0], latestPaidDate,paidAmount : paidAmount });
      } else if (unpaidMonths < 3) {
        const totalBalance = bills.reduce((total, bill) => {
          return bill.paid_status === 0 ? total + bill.amount_due : total;
        }, 0);
  
        let lastDueDate;
        for (const bill of bills) {
          if (bill.paid_status === 0) {
            lastDueDate = bills.reduce((latestDate, bill) => {
              return bill.paid_status === 0 && bill.bill_due_date < latestDate
                ? bill.bill_due_date
                : latestDate;
            }, bills[0].bill_due_date);
          }
        }
  
        notPaidLessThan3Months.push({
          ...bills[0],
          dueDate: lastDueDate,
          totalBalance,
        });
      } else {
        const totalBalance = bills.reduce((total, bill) => {
          return bill.paid_status === 0 ? total + bill.amount_due : total;
        }, 0);
  
        let lastDueDate;
        for (const bill of bills) {
          if (bill.paid_status === 0) {
            lastDueDate = bills.reduce((latestDate, bill) => {
              return bill.paid_status === 0 && bill.bill_due_date < latestDate
                ? bill.bill_due_date
                : latestDate;
            }, bills[0].bill_due_date);
          }
        }
  
        notPaidMoreThan3Months.push({
          ...bills[0],
          dueDate: lastDueDate,
          totalBalance,
        });
      }
    }
    const result = {
      uniquePaidUsers: uniqueData,
      notPaidLessThan3Months: notPaidLessThan3Months,
      notPaidMoreThan3Months: notPaidMoreThan3Months,
    };
  
    return result;
  }


  //--------------------------------------------------------------------------------------------




  function setActiveListItem(clickedId) {
    const listItems = document.querySelectorAll('.tab-bar li');
  
    listItems.forEach(item => {
      if (item.id === clickedId) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });
  }

  //-----------------------------------------------------------------------------------------------------------------------------

  function showTab(tabName) {

    setActiveListItem(tabName + 'Bills');   
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


  function logout(){
    const session = sessionStorage.getItem('sid');
    $.post('/logout',{
      session : session
    },
    (data)=>{
      if(data){
        window.location.href = '/admin'
      }
    })
  }
