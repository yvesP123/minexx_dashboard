import React,{useState, useEffect, useContext, useRef} from 'react';
import { Button, Modal, Dropdown, Nav, Tab, Table } from 'react-bootstrap';
import {Link, useNavigate, useParams} from 'react-router-dom';
import { ThemeContext } from '../../context/ThemeContext';
import { baseURL_ } from '../../config'
import moment from 'moment';
import {startOfMonth, isWeekend, isBefore} from 'date-fns'
import { Logout } from '../../store/actions/AuthActions';
import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import axiosInstance from '../../services/AxiosInstance';
import ReactApexChart from 'react-apexcharts';
import { translations } from './Reportstranslation';


const ticketData = [
    {number:"01", emplid:"Emp-0852", count:'3'},
    {number:"02", emplid:"Emp-2052", count:'5'},
    {number:"03", emplid:"Emp-3052", count:'9'},
    {number:"04", emplid:"Emp-3055", count:'8'},
    {number:"05", emplid:"Emp-1052", count:'6'},
    {number:"06", emplid:"Emp-3055", count:'1'},
    {number:"07", emplid:"Emp-3052", count:'4'},
];

const Reports = ({language,country}) => {

    const {type} = useParams()
    const navigate = useNavigate()
	const dispatch = useDispatch()
    // const [dailyData, setDailyData] = useState({ cassiterite: [], coltan: [], wolframite: [] });
    const access = localStorage.getItem(`_dash`) || '3ts'
    const [attachment, setattachment] = useState()
    const [companies, setcompanies] = useState([])
    const [company, setcompany] = useState()
    const [trace, settrace] = useState({
        production: [],
        bags: [],
        blending: {
            header: [],
            rows: []
        },
        drums: [],
        bags_proc: [],
        processing: [],
        exports: []
    })
    const [exportsPage, setexportsPage] = useState(1)
    const [drumsPage, setdrumsPage] = useState(1)
    const [prodPage, setprodPage] = useState(1)
    const [procPage, setprocPage] = useState(1)
    const [bagsPage, setbagsPage] = useState(1)
    const [bagsProcPage, setbagsProcPage] = useState(1)
    const { changeTitle } = useContext(ThemeContext)
    const [data, setData] = useState(
		document.querySelectorAll("#report_wrapper tbody tr")
	);
    let days = 0
    for (let date = startOfMonth(new Date()); isBefore(date, new Date()); date = moment(date).add(1, "day").toDate()) {
        if(!isWeekend(date)){
            days++
        }
    }
    const t = (key) => {
        if (!translations[language]) {
          console.warn(`Translation for language "${language}" not found`);
          return key;
        }
        return translations[language][key] || key;
      };
    const [daily, setdaily] = useState({
        cassiterite: {
            dailyTarget: 4.76,
            dailyActual: 0,
            mtdTarget: 100,
            mtdActual: 0,
        },
        coltan: {
            dailyTarget: 0.38,
            dailyActual: 0,
            mtdTarget: 8,
            mtdActual: 0,
        },
        wolframite: {
            dailyTarget: 0.19,
            dailyActual: 0,
            mtdTarget: 4,
            mtdActual: 0,
          }
    })
    // const t = (key) => {
    //     if (!translations[language]) {
    //       console.warn(`Translation for language "${language}" not found`);
    //       return key;
    //     }
    //     return translations[language][key] || key;
    //   };
    const[monthly,setMonthly]=useState({
        cassiterite:
        {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,
        },
        coltan: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        },
        wolframite: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        }


    });
    const[monthlypurchase,setMonthlyPurchase]=useState({
        cassiterite:
        {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,
        },
        coltan: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        },
        wolframite: {
            january:0,
            february:0,
            march:0,
            april:0,
            may:0,
            june:0,
            july:0,
            august:0,
            september:0,
            october:0,
            november:0,
            december:0,

        }


    })
    const [balance, setbalance] = useState({
        cassiterite: {
          
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            pending: 0,
            rmr: 0,
            
        },
        coltan: {
           
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            pending: 0,
            rmr: 0,
            
        },
        wolframite: {
           
            minexx: 0,
            supplier: 0,
            buyer: 0,
            shipped: 0,
            pending: 0,
            rmr: 0,
            
        }
    })

    const [deliveries, setdeliveries] = useState({
        cassiterite: {
            daily: 0,
            weekly: 0,
            monthly: 0,
          },
        coltan: {
            daily: 0,
            weekly: 0,
            monthly: 0,
          },
        wolframite: {
            daily: 0,
            weekly: 0,
            monthly: 0,
        }
    })
	const sort = 20;
	const activePag = useRef(0);
	const user = JSON.parse(localStorage.getItem(`_authUsr`))

	const chageData = (frist, sec) => {
		for (var i = 0; i < data.length; ++i) {
			if (i >= frist && i < sec) {
				data[i].classList.remove("d-none");
			} else {
				data[i].classList.add("d-none");
			}
		}
	};

    const showAttachment  = (file, field)=>{
        axiosInstance.post(`${baseURL_}image`, {
            file
        }).then(response=>{
            setattachment({image: response.data.image, field})
            //this is incase the view permission was not granted before
            setTimeout(()=>{
                setattachment({image: response.data.image, field})
            }, 5000)
        }).catch(err=>{
            try{
                if(err.response.code === 403){
                    dispatch(Logout(navigate))
                }else{
                    toast.warn(err.response.message)
                }
            }catch(e){
                toast.error(err.message)
            }
        })
    }

    const changeCompany = (e)=>{
        const input = e.currentTarget.value
        if(input === 'Select Company'){
            setcompany(null)
            return toast.warn("Please select a company to generate trace report for.")
        }
        const selected = JSON.parse(input);
        setcompany(selected)
        toast.info('Generating trace report, please wait...', {
            delay: 100,
            autoClose: true
        })
    }
    
    const loadCompanies =  ()=>{
        let normalizedCountry = country.trim();
            
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
            // Randomly choose one of the three formats
             normalizedCountry ='.Rwanda';
            // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
        } else {
            // For other countries, remove leading/trailing dots and spaces
            normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
        axiosInstance.get(`/companies`,
            {
                params: {
                    country: normalizedCountry,
                }
            }).then(response=>{
            setcompanies(response.data.companies)
        })
    }

    const loadReport = ()=>{
        if(type === `trace`){
            settrace({
                production: [],
                bags: [],
                blending: {
                    header: [],
                    rows: []
                },
                purchases: {
                    header: [],
                    rows: []
                },
                drums: [],
                bags_proc: [],
                processing: [],
                exports: []
            })
        }
        if(type === `trace` && !company){
            return
        }

        let normalizedCountry = country.trim();
            
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
            // Randomly choose one of the three formats
             normalizedCountry ='.Rwanda';
            // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
        } else {
            // For other countries, remove leading/trailing dots and spaces
            normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
        axiosInstance.get(`/report/${type !== 'trace' ? type : type+'/'+company?.id}`,
            {
                params: {
                    country: normalizedCountry,
                }
            }).then(response=>{
            if(type === `daily`){
                setdaily(prevDaily => ({
                    cassiterite: {
                        ...prevDaily.cassiterite,
                        ...response.data.cassiterite?.company?.[normalizedCountry]
                    },
                    coltan: {
                        ...prevDaily.coltan,
                        ...response.data.coltan?.company?.[normalizedCountry]
                    },
                    wolframite: {
                        ...prevDaily.wolframite,
                        ...response.data.wolframite?.company?.[normalizedCountry]
                    }
                }));
            }
            if (type === 'mtd') {
                setbalance(prevBalance => ({
                  cassiterite: {
                    ...prevBalance.cassiterite,
                    ...response.data.cassiterite.company[normalizedCountry]
                  },
                  coltan: {
                    ...prevBalance.coltan,
                    ...response.data.coltan.company[normalizedCountry]
                  },
                  wolframite: {
                    ...prevBalance.wolframite,
                    ...response.data.wolframite.company[normalizedCountry]
                  }
                }));
              }
            if(type === `deliveries`){

                setdeliveries(prevDeliveries=>
                ({
                    cassiterite: {
                        ...prevDeliveries.cassiterite,
                        ...response.data.cassiterite.company[normalizedCountry]
                      },
                      coltan: {
                        ...prevDeliveries.coltan,
                        ...response.data.coltan.company[normalizedCountry]
                      },
                      wolframite: {
                        ...prevDeliveries.wolframite,
                        ...response.data.wolframite.company[normalizedCountry]
                      }

                })

                )
            }
            if(type === `trace`){
                if(company){
                    toast.success("Trace report generated successfully!")
                }
                settrace(response.data.trace)
            }
        }).catch(err=>{
            try{
				if(err.response.code === 403){
					dispatch(Logout(navigate))
				}else{
					toast.warn(err.response.message)
				}
			}catch(e){
				toast.error(err.message)
			}
        })
    }

    function paginate(array, page_number, page_size) {
        // human-readable page numbers usually start with 1, so we reduce 1 in the first argument
        return array ? array.slice((page_number - 1) * page_size, page_number * page_size) : []
    }

    useEffect(() => {
        setData(document.querySelectorAll("#report_wrapper tbody tr"));
        changeTitle(`${t('Report')} | Minexx`)
        loadReport()
        loadMonthlyData();
        loadMonthlyPurchase();
        if(type === 'trace'){
            loadCompanies()
        }
    }, [type, company,language,country]);
    
    const loadMonthlyData = () => {

        let normalizedCountry = country.trim();
            
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
            // Randomly choose one of the three formats
             normalizedCountry ='.Rwanda';
            // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
        } else {
            // For other countries, remove leading/trailing dots and spaces
            normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
        axiosInstance.get(`/report/Monthly`,
            {
                params: {
                    country: normalizedCountry,
                }
            })
            .then(response => {
                
                setMonthly({
                    cassiterite: response.data.cassiterite.company[normalizedCountry].monthly,
                    coltan: response.data.coltan.company[normalizedCountry].monthly,
                    wolframite: response.data.wolframite.company[normalizedCountry].monthly
                  });
    
                console.log('Monthly data:', {  
                    cassiterite:response.data.cassiterite.company[normalizedCountry].monthly ,
                   
                });
    
            })
            .catch(err => {
                try {
                    if (err.response.code === 403) {
                        dispatch(Logout(navigate));
                    } else {
                        console.log(err.response.message);
                      //  toast.warn(err.response.message);
                    }
                } catch (e) {
                    console.log(err.message);
                   // toast.error(err.message);
                }
            });
    };
    const loadMonthlyPurchase = () => {
        let normalizedCountry = country.trim();
            
        // Special handling for Rwanda
        if (normalizedCountry.toLowerCase() === 'rwanda') {
            // Randomly choose one of the three formats
             normalizedCountry ='.Rwanda';
            // normalizedCountry = formats[Math.floor(Math.random() * formats.length)];
        } else {
            // For other countries, remove leading/trailing dots and spaces
            normalizedCountry = normalizedCountry.replace(/^\.+|\.+$/g, '');
        }
        axiosInstance.get(`/report/purchaseMonthly`, 
            {
            params: {
                country: normalizedCountry,
            }
        })
            .then(response => {
               

                setMonthlyPurchase({
                    cassiterite: response.data.purchases.cassiterite.company[normalizedCountry].monthly,
                    coltan: response.data.purchases.coltan.company[normalizedCountry].monthly,
                    wolframite: response.data.purchases.wolframite.company[normalizedCountry].monthly
                  });
                console.log('MonthlyPurchase data:', {  
                        cassiterite: response.data.purchases.cassiterite.company[normalizedCountry].monthly,
                        coltan: response.data.purchases.coltan.company[normalizedCountry].monthly,
                        wolframite: response.data.purchases.wolframite.company[normalizedCountry].monthly
                    });
    
            })
            .catch(err => {
                try {
                    if (err.response.code === 403) {
                        dispatch(Logout(navigate));
                    } else {
                        //toast.warn(err.response.message);
                    }
                } catch (e) {
                  //  toast.error(err.message);
                }
            });
    };

  
   // Active pagginarion
   activePag.current === 0 && chageData(0, sort);
   // paggination
   let paggination = (arr)=>Array(Math.ceil(arr.length / sort))
      .fill()
      .map((_, i) => i + 1);

   // Active paggination & chage data
	const onClick = (i) => {
		activePag.current = i;
		chageData(activePag.current * sort, (activePag.current + 1) * sort);
		//settest(i);
	};
   //Chart For the Daily 
   const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

   const chartSeries = [
     {
       name: 'Cassiterite',
       data: months.map(month => (monthly.cassiterite[month] || 0) / 1000),
     },
     {
       name: 'Coltan',
       data: months.map(month => (monthly.coltan[month] || 0) / 1000),
     },
     {
       name: 'Wolframite',
       data: months.map(month => (monthly.wolframite[month] || 0) / 1000),
     },
   ];

const chartOptions = {
    chart: {
        type: 'bar',
        height: 500,
        stacked: false,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
    },
    xaxis: {
        categories: [
            t('January'), 
            t('February'), 
            t('March'), 
            t('April'), 
            t('May'), 
            t('June'),
            t('July'), 
            t('August'), 
            t('September'), 
            t('October'), 
            t('November'), 
            t('December')
        ],
    },
    yaxis: {
        title: {
            text: t('MTDActuals'),
        },
        labels: {
            formatter: function (value) {
                return value.toFixed(2); // Adjust the number of decimal places as needed
            },
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + ' TONS';
            },
        },
    },
    fill: {
        opacity: 1,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        labels: {
            colors: ['#fff','#fff','#fff']
        }
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '70%',
                    },
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetX: 0,
                },
            },
        },
    ],
};
 //end the Daily Graph

    //chart For Balance in Country
    const chartSeries_Balance = [
        {
            name: t('WithRMR'),
            data: [
                ((balance.cassiterite.rmr || 0) / 1000).toFixed(2),
                ((balance.coltan.rmr || 0) / 1000).toFixed(2),
                ((balance.wolframite.rmr || 0)/ 1000).toFixed(2),
            ],
            
            
        },
        {
            name: t('WithMinexx'),
            data: [
                ((balance.cassiterite.minexx || 0)/ 1000).toFixed(2),
                ((balance.coltan.minexx || 0)/ 1000).toFixed(2),
                ((balance.wolframite.minexx || 0)/ 1000).toFixed(2),
            ],
        },
        {
            name: t('PendingShipment'),
            data: [
                ((balance.cassiterite.pending || 0) /  1000).toFixed(2),
                ((balance.coltan.pending || 0 )/ 1000).toFixed(2),
                ((balance.wolframite.pending || 0)/ 1000).toFixed(2),
            ],
        },
        {
            name: t('Shipped'),
            data: [
                ((balance.cassiterite.shipped || 0) / 1000).toFixed(2),
                ((balance.coltan.shipped || 0 )/ 1000).toFixed(2),
                ((balance.wolframite.shipped || 0 )/1000).toFixed(2),
            ],
        },
        {
            name: t('WithBuyer'),
            data: [
                ((balance.cassiterite.buyer || 0) / 1000).toFixed(2),
                ((balance.coltan.buyer || 0 )/ 1000).toFixed(2),
                ((balance.wolframite.buyer || 0) / 1000).toFixed(2),
            ],
        },
        
    ];

    const chartOptions_Balance = {
        chart: {
            type: 'bar',
            height: 500,
            stacked: false,
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                endingShape: 'rounded',
            },
        },
        dataLabels: {
            enabled: false,
        },
        stroke: {
            show: true,
            width: 1,
            colors: ['#fff'],
        },
        xaxis: {
            categories: ['Cassiterite', 'Coltan', 'Wolframite'],
        },
        yaxis: {
            title: {
                text: t('Percentage'),
            },
            labels: {
                formatter: function (value) {
                    return value.toFixed(2); // Adjust the number of decimal places as needed
                },
            },
        },
        tooltip: {
            y: {
                formatter: function (val, { series, seriesIndex }) {
                    const seriesName = series?.[seriesIndex]?.name;
                    if (seriesName && seriesName.includes('%')) {
                        return val + ' %';
                    }
                    return val + ' TONS';
                },
            },
        },
        fill: {
            opacity: 1,
        },
        legend: {
            position: 'top',
            horizontalAlign: 'left',
            offsetX: 40,
            labels: {
                colors: ['#ffff', '#ffff', '#ffff','#ffff', '#ffff'] // Change these colors as needed
            }
        },
        responsive: [
            {
                breakpoint: 1000,
                options: {
                    plotOptions: {
                        bar: {
                            columnWidth: '70%',
                        },
                    },
                    legend: {
                        position: 'bottom',
                        horizontalAlign: 'center',
                        offsetX: 0,
                    },
                },
            },
        ],
    };
//End for Balance in Country
//const monthss = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
//Graph for Purchased
const monthss = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const chartSeries_Purchase = [
  {
    name: 'Cassiterite',
    data: monthss.map(month => monthlypurchase.cassiterite[month] || 0),
  },
  {
    name: 'Coltan',
    data: monthss.map(month => monthlypurchase.coltan[month] || 0),
  },
  {
    name: 'Wolframite',
    data: monthss.map(month => monthlypurchase.wolframite[month] || 0),
  },
];
const chartOptions_Purchase = {
    chart: {
        type: 'bar',
        height: 500,
        stacked: false,
    },
    plotOptions: {
        bar: {
            horizontal: false,
            columnWidth: '55%',
            endingShape: 'rounded',
        },
    },
    dataLabels: {
        enabled: false,
    },
    stroke: {
        show: true,
        width: 1,
        colors: ['#fff'],
    },
    xaxis: {
        categories: [
            t('January'), 
            t('February'), 
            t('March'), 
            t('April'), 
            t('May'), 
            t('June'),
            t('July'), 
            t('August'), 
            t('September'), 
            t('October'), 
            t('November'), 
            t('December')
        ],
    },
    yaxis: {
        title: {
            text: t('TotalAmountPaid'),
        },
        labels: {
            formatter: function (value) {
                return value.toFixed(2); // Adjust the number of decimal places as needed
            },
        },
    },
    tooltip: {
        y: {
            formatter: function (val) {
                return val + ' Money($)';
            },
        },
    },
    fill: {
        opacity: 1,
    },
    legend: {
        position: 'top',
        horizontalAlign: 'left',
        offsetX: 40,
        labels: {
            colors: ['#fff','#fff','#fff']
        }
    },
    responsive: [
        {
            breakpoint: 1000,
            options: {
                plotOptions: {
                    bar: {
                        columnWidth: '70%',
                    },
                },
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetX: 0,
                },
            },
        },
    ],
};
//end Purchase 
    return (
        <>
            { attachment ? <Modal size='lg' show={attachment} onBackDropClick={()=>setattachment(null)}>
                <Modal.Header>
                    <h3 className='modal-title'>{attachment.field}</h3>
                    <Link className='modal-dismiss' data-toggle="data-dismiss" onClick={()=>setattachment(null)}>x</Link>
                </Modal.Header>
                <Modal.Body>
                    <img alt='' className='rounded mt-4' width={'100%'} src={`https://lh3.googleusercontent.com/d/${attachment.image}=w2160?authuser=0`}/>
                </Modal.Body>
            </Modal> : null }
            <div className="page-titles">
				<ol className="breadcrumb">
					<li className="breadcrumb-item active"><Link to={"#"}>{t("Dashboard")}</Link></li>
					<li className="breadcrumb-item"><Link to={"#"} >{t("Report")}</Link></li>
					<li className="breadcrumb-item">
                    <Link to={"#"}>
                        {type === 'today' 
                        ? "Today's Report" 
                        : type === 'trace' 
                            ? `${t('TraceReport')} ${company ? `[${company.name}]` : ''}`
                            : type === 'daily' 
                            ? t('TotalStockDelivery')
                            : type === 'mtd' 
                                ? t('InStockCountryBalance')
                                : t('TotalPurchase')}
                    </Link>
                    </li>
				</ol>
			</div>
            {/**<div className="row mb-5 align-items-center">
				<div className="col-lg-3 mb-4 mb-lg-0">
					<Link to={"#"} className="btn btn-outline-primary light  btn-lg btn-block rounded" onClick={()=>{} }> + Generate Report</Link>
				</div>
            </div>**/}
            <div className="row">
                { type === `admin` ?
                <div className="col-lg-12">
                    <div className="card">
                        <div className="card-header">
                            <h4 className="card-title">Generated Reports</h4>
                        </div>
                        <div className="card-body">
                            <div className="table-responsive ticket-table">
                                <div id="report_wrapper" className="dataTables_wrapper no-footer">
                                    <div className='d-flex justify-content-between mb-3 custom-tab-list'>
                                        <div className='d-flex align-items-center'>
                                            <label className="me-2">Show</label>
                                            <Dropdown className="search-drop">
                                                <Dropdown.Toggle className="">10</Dropdown.Toggle>
                                                <Dropdown.Menu>
                                                    <Dropdown.Item>25</Dropdown.Item>
                                                    <Dropdown.Item>50</Dropdown.Item>
                                                    <Dropdown.Item>75</Dropdown.Item>
                                                    <Dropdown.Item>100</Dropdown.Item>
                                                </Dropdown.Menu>
                                            </Dropdown>
                                            <label className="ms-2">entries</label>
                                        </div>
                                        <div className="col-2 d-flex align-items-center">
                                            <label className="me-2">Search:</label>
                                            <input type="search" placeholder="" className="form-control" />
                                        </div>
                                    </div>
                                    <table id="example" className="display dataTablesCard table-responsive-xl dataTable no-footer w-100">
                                        <thead>
                                            <tr>                                               	                                            
                                                <th>ID</th>
												<th>Name</th>
												<th>Requested</th>
												<th>Completed On</th>
												<th>Status</th>  
												<th>Action</th>                                           
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {ticketData.slice(0, 1).map((item, index)=>(
                                                <tr key={index}>     
                                                    <td className="sorting_1">{item.number}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{user.type === `minexx` ? `Production Data Report` : `Minexx Trace Data Report`} (11/01/2023 - 12/31/2023)</Link>
                                                        </div>
                                                    </td>                                                    
                                                    <td>
                                                        Jan 10, 2024 02:23
                                                    </td>
                                                    <td>Jan 9, 2024 17:02</td>
                                                    <td>
                                                        <span className="badge light badge-success">Successful</span>
                                                    </td>
                                                    <td>
                                                        <button className="btn btn-sm light btn-success">Download PDF</button>
                                                        &emsp;
                                                        <button className="btn btn-sm light btn-primary">Download XLSL</button>
                                                    </td>
                                                </tr>
                                            ))}                                           
                                        </tbody>                                        
                                    </table>
                                    <div className="d-sm-flex text-center justify-content-between align-items-center mt-3 mb-3">
                                        <div className="dataTables_info">
                                        {t("Showing")} {activePag.current * sort + 1} {t("To")}{" "}
                                            {data.length > (activePag.current + 1) * sort
                                                ? (activePag.current + 1) * sort
                                                : data.length}{" "}
                                            {t("Of")} {data.length} {t("Entries")}
                                        </div>
                                        <div
                                            className="dataTables_paginate paging_simple_numbers mb-0"
                                            id="example2_paginate"
                                        >
                                            <Link
                                                className="paginate_button previous disabled"
                                                style={{
                                                    minWidth: '120px',  // Adjust this value as needed
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    padding: '8px 12px',  // Adjust padding to your preference
                                                    display: 'inline-block',
                                                    textAlign: 'center'
                                                }}
                                                to="/reports"
                                                onClick={() =>
                                                    activePag.current > 0 &&
                                                    onClick(activePag.current - 1)
                                                }
                                            >
                                                {t("Previous")}
                                            </Link>
                                            <Link
                                                className="paginate_button next"
                                                to="/reports"
                                                onClick={() =>  {
                                                    console.log("next")
                                                        bagsPage < paggination(trace?.bags || []).length &&
                                                        onClick(()=>setbagsPage(bagsPage+1))
                                                    }
                                                }
                                            >
                                                {t("Next")}
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                :
                type === `daily` ? 
                <div className='row'>
                  <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                {/* Stock Delivery */}
                                <h4 className="card-title">Cassiterite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div id="report_wrapper" className="no-footer">
                                        <table id="cassiteriteTargets" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("Date")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="ct">     
                                                    <td className="sorting_1">{t("DailyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.dailyTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct2">     
                                                    <td className="sorting_1">{t("DailyActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.dailyActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct3">     
                                                    <td className="sorting_1">{t("MonthlyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.mtdTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct4">     
                                                    <td className="sorting_1">{t("MTDTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(4.76*days).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct5">
                                                    <td className="sorting_1">{t("MTDActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.cassiterite.mtdActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ct6">     
                                                    <td className="sorting_1">{t("MTDActualsVsTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{((daily.cassiterite.mtdActual/1000)/(4.76*days)*100).toFixed(2)}%</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Coltan</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="coltanTargets" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("Date")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="col1">     
                                                    <td className="sorting_1">{t("DailyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.dailyTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col2">     
                                                    <td className="sorting_1">{t("DailyActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.dailyActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col3">     
                                                    <td className="sorting_1">{t("MonthlyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.mtdTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col4">     
                                                    <td className="sorting_1">{t("MTDTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(0.38*days).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col5">     
                                                    <td className="sorting_1">{t("MTDActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.coltan.mtdActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="col6">     
                                                    <td className="sorting_1">{t("MTDActualsVsTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{((daily.coltan.mtdActual/1000)/(0.38*days)*100).toFixed(2)}%</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Wolframite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="wolframiteTargets" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("Date")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="wt1">     
                                                    <td className="sorting_1">{t("DailyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.dailyTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt2">     
                                                    <td className="sorting_1">{t("DailyActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.dailyActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt3">     
                                                    <td className="sorting_1">{t("MonthlyTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.mtdTarget/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt4">
                                                    <td className="sorting_1">{t("MTDTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(0.19*days).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt5">     
                                                    <td className="sorting_1">{t("MTDActuals")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(daily.wolframite.mtdActual/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wt6">     
                                                    <td className="sorting_1">{t("MTDActualsVsTarget")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{((daily.wolframite.mtdActual/1000)/(0.19*days)*100).toFixed(2)}%</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 mt-4'>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">{t("MineralsPerformanceOverview")}</h4>
                            </div>
                            <div className="card-body">
                            <ReactApexChart
                                options={chartOptions}
                                series={chartSeries}
                                type="bar"
                                height={500}
                            />
                            </div>
                        </div>
                    </div>
                </div>
                
                :
                type === `mtd` ?
                <div className='row'>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                {/* In Stock Country */}
                                <h4 className="card-title">Cassiterites</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div id="report_wrapper" className="no-footer">
                                        <table id="cassiteriteBalance" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("OverallBalanceAsOf")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="cb2">     
                                                    <td className="sorting_1">{t("WithRMR")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb1">     
                                                    <td className="sorting_1">{t("WithMinexx")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb5">     
                                                    <td className="sorting_1">{t("PendingShipment")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.pending/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb4">     
                                                    <td className="sorting_1">{t("Shipped")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.shipped/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cb3">     
                                                    <td className="sorting_1">{t("WithBuyer")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.cassiterite.buyer/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-danger">
                            <div className="card-header">
                                <h4 className="card-title">Coltan</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="coltanBalance" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("OverallBalanceAsOf")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="ccb2">     
                                                    <td className="sorting_1">{t("WithRMR")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb1">     
                                                    <td className="sorting_1">{t("WithMinexx")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb5">     
                                                    <td className="sorting_1">{t("PendingShipment")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.pending/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb4">     
                                                    <td className="sorting_1">{t("Shipped")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.shipped/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccb3">     
                                                    <td className="sorting_1">{t("WithBuyer")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.coltan.buyer/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Wolframite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="wolframiteBalance" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("OverallBalanceAsOf")}</th>
                                                    <th>{new Date().toUTCString().substring(0, 16)}</th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="wb2">     
                                                    <td className="sorting_1">{t("WithRMR")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.rmr/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb1">     
                                                    <td className="sorting_1">{t("WithMinexx")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.minexx/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb5">     
                                                    <td className="sorting_1">{t("PendingShipment")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.pending/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb4">     
                                                    <td className="sorting_1">{t("Shipped")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.shipped/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wb3">     
                                                    <td className="sorting_1">{t("WithBuyer")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">{(balance.wolframite.buyer/1000).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 mt-4'>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">{t("MineralsPerformanceOverview")}</h4>
                            </div>
                            <div className="card-body">
                                <ReactApexChart
                                    options={chartOptions_Balance}
                                    series={chartSeries_Balance}
                                    type="bar"
                                    height={500}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                :
                type === `deliveries` ?
                <div className='row'>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                {/* Total Purchase */}
                                <h4 className="card-title">Cassiterites</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div id="report_wrapper" className="no-footer">
                                        <table id="cassiteritePurchases" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("TotalPurchase")}</th>
                                                    <th></th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="cd1">     
                                                    <td className="sorting_1">{new Date().toUTCString().substring(0, 16)}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.cassiterite.daily).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cd2">     
                                                    <td className="sorting_1">{t("ThisWeek")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.cassiterite.weekly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="cd3">     
                                                    <td className="sorting_1">{t("ThisMonth")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.cassiterite.monthly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card card-danger">
                            <div className="card-header">
                                <h4 className="card-title">Coltan</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="coltanPurchases" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("TotalPurchase")}</th>
                                                    <th></th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="ccd1">     
                                                    <td className="sorting_1">{new Date().toUTCString().substring(0, 16)}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.coltan.daily).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccd2">     
                                                    <td className="sorting_1">{t("ThisWeek")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.coltan.weekly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="ccd3">     
                                                    <td className="sorting_1">{t("ThisMonth")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.coltan.monthly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">Wolframite</h4>
                            </div>
                            <div className="card-body">
                                <div className="table-responsive">
                                    <div className="dataTables_wrapper no-footer">
                                        <table id="example" className="display dataTablesCard table-responsive-sm dataTable no-footer">
                                            <thead>
                                                <tr>                                               	                                            
                                                    <th>{t("TotalPurchase")}</th>
                                                    <th></th>                                          
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr key="wd1">     
                                                    <td className="sorting_1">{new Date().toUTCString().substring(0, 16)}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.wolframite.daily).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wd2">     
                                                    <td className="sorting_1">{t("ThisWeek")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.wolframite.weekly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr key="wd3">     
                                                    <td className="sorting_1">{t("ThisMonth")}</td>
                                                    <td>						
                                                        <div>
                                                            <Link to={"#"} className="h5">${(deliveries.wolframite.monthly).toFixed(2)}</Link>
                                                        </div>
                                                    </td>
                                                </tr>
                                            </tbody>                                        
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='col-12 mt-4'>
                        <div className="card">
                            <div className="card-header">
                                <h4 className="card-title">{t("MineralsPerformanceOverview")}</h4>
                            </div>
                            <div className="card-body">
                                <ReactApexChart
                                    options={chartOptions_Purchase}
                                    series={chartSeries_Purchase}
                                    type="bar"
                                    height={500}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                : type === 'trace' ?
                <div className='row'>
                    { company ? <div>
                    <div className='row'>
                        <div className='col-md-3'>
                            <select onChange={changeCompany} className='form-control'>
                                <option>{t('SelectCompany')}</option>
                                { companies.map(company=><option key={company.id} value={JSON.stringify(company)}>{company.name}</option>) }
                            </select>
                        </div>
                    </div>
                    <Tab.Container defaultActiveKey="production">
                        <Nav as="ul" className="nav nav-pills review-tab" role="tablist">
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link  px-2 px-lg-3"  to="#production" role="tab" eventKey="production">
                                    {t("Production")}
                                </Nav.Link>
                            </Nav.Item>
                            { access === `3ts` ?
                            <>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#bags" role="tab" eventKey="bags">
                                    {t("BagsProduced")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#processing" role="tab" eventKey="processing">
                                    {t("Processing")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#bags_proc" role="tab" eventKey="bags_proc">
                                    {t("BagsProcessed")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#blending" role="tab" eventKey="blending">
                                    {t("Blending")}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#drums" role="tab" eventKey="drums">
                                    {t("Drums")}
                                </Nav.Link>
                            </Nav.Item>
                            </> :
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#purchase" role="tab" eventKey="purchase">
                                    {t("Purchase")}
                                </Nav.Link>
                            </Nav.Item> }
                            <Nav.Item as="li" className="nav-item">
                                <Nav.Link className="nav-link px-2 px-lg-3" to="#exports" role="tab" eventKey="exports">
                                    {t("Exports")}
                                </Nav.Link>
                            </Nav.Item>
                        </Nav>
                        <Tab.Content className='mt-10' style={{ marginTop: 25 }}>
                            <Tab.Pane eventKey="production" id='production'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Production")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            { access === `3ts` ? <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th></th>
                                                        <th className="text-center text-dark">
                                                            {t("ProductionWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("BusinessLocation")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NameOfRMBRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TraceabilityAgent")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NameOfOperatorRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NumberOfBags")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Note")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        trace.production.map((prod, i)=><tr key={`prod${i}`}>
                                                            <td>{prod.picture ? <img alt='' className='rounded mt-4' style={{objectFit: 'cover'}} width={'128px'} height={'128px'} src={`https://lh3.googleusercontent.com/d/${prod.picture}=w2160?authuser=0`}/> : 'No Picture'}</td>
                                                            <td>{prod.weight}</td>
                                                            <td>{prod.location}</td>
                                                            <td>{prod.rmbRep}</td>
                                                            <td>{prod.traceAgent}</td>
                                                            <td>{prod.operator}</td>
                                                            <td>{prod.bags}</td>
                                                            <td>{prod.totalWeight}</td>
                                                            <td>{prod.note}</td>
                                                        </tr>)
                                                    }
                                                    {
                                                        trace.production.length === 0 ? <tr>
                                                            <td colSpan={9}>{t('NoProduction')}</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table> : <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                <tr>
                                                {trace.production?.header?.map(h => (
                                                    <th 
                                                        className="text-center text-dark"
                                                        key={h} // Added key for React list rendering
                                                    >
                                                        {t(h)}
                                                    </th>
                                                ))}
                                            </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        trace.production?.production?.map((prod, i)=><tr key={`prod${i}`}>
                                                            {   prod.map(p=><td>{p.includes('Images') ? <button onClick={()=>showAttachment(p, `Transaction: ${prod[0]}`)} className='btn btn-sm btn-primary'>View</button> : p}</td>) }
                                                        </tr>)
                                                    }
                                                    {
                                                        trace.production?.production?.length === 0 ? <tr>
                                                            <td colSpan={9}>The selected company does not have any production to show.</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>}
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            { access === `3ts` ?
                            <>
                            <Tab.Pane eventKey="bags" id='bags'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("BagsProduced")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>{t("TagNumber")}</th>
                                                        <th className="text-center text-dark">
                                                        {t("Weight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TunnelPitNumberOrName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProductionMiningDate")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("MinerName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TransporterName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RMBRepresentativeAtMineSite")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("SecurityOfficerName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("EstimatedConcentratePercentage")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ColorOfTheBagDrumPackage")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TransportMode")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TransportItinerary")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Time")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProductionID")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        paginate(trace?.bags || [], bagsPage, 20).map((bag, i)=><tr key={`bag${i}`}>
                                                            <td>{bag.tag}</td>
                                                            <td>{bag.weight}</td>
                                                            <td>{bag.tunnel}</td>
                                                            <td>{bag.date}</td>
                                                            <td>{bag.miner}</td>
                                                            <td>{bag.transporter}</td>
                                                            <td>{bag.rmbRep}</td>
                                                            <td>{bag.security}</td>
                                                            <td>{bag.concentrate}</td>
                                                            <td>{bag.color}</td>
                                                            <td>{bag.transport}</td>
                                                            <td>{bag.itinerary}</td>
                                                            <td>{bag.time}</td>
                                                            <td>{bag.production}</td>
                                                        </tr>)
                                                    }
                                                    {
                                                        trace?.bags.length === 0 ? <tr>
                                                            <td colSpan={14}>{t("NoSelected")}</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(bagsPage-1) * sort + 1} {t("To")}{" "}
                                                {trace?.bags.length > bagsPage * sort
                                                    ? bagsPage*sort
                                                    : trace?.bags.length}{" "}
                                                {t("Of")}{trace?.bags.length} {t("Entries")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    style={{
                                                        minWidth: '120px',  // Adjust this value as needed
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        padding: '8px 12px',  // Adjust padding to your preference
                                                        display: 'inline-block',
                                                        textAlign: 'center'
                                                    }}
                                                    // to="/reviews"
                                                    onClick={() =>
                                                    bagsPage > 1 && setbagsPage(bagsPage - 1)
                                                    }
                                                >
                                                    {t("Previous")}
                                                </Link>
                                                <Link
                                                    className="paginate_button next mx-4"
                                                    onClick={() =>
                                                        bagsPage < paggination(trace?.bags || []).length &&
                                                        setbagsPage(bagsPage + 1)
                                                    }
                                                >
                                                    {t("Next")}
                                                </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="processing" id='processing'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Processing")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            {t("Date")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("BusinessLocation")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RMBRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TraceabilityAgent")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("OperatorRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("MineralType")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NumberOfInputBags")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalInputWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NumberOfOutputBags")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalOutputWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TagNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TaggingDateTime")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Grade")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProcessingWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Note")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NameOfMineSupplier")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("PresenceOfASI")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Laboratory")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Certificate")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("PricingUSD")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("LME")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TC")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("PricePerTaPercentage")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("UnitPrice")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalPrice")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("PaymentMethod")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("SecurityOfficerName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("LotNumber")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        paginate(trace.processing, procPage, sort).map(proc=><tr key={proc.id}>
                                                            <td>{proc.picture ? <img alt='' className='rounded mt-4' style={{objectFit: 'cover'}} width={'128px'} height={'128px'} src={`https://lh3.googleusercontent.com/d/${proc.picture}=w2160?authuser=0`}/> : 'No Picture'}</td>
                                                            <td>{proc.date}</td>
                                                            <td>{proc.location}</td>
                                                            <td>{proc.rmb}</td>
                                                            <td>{proc.trace}</td>
                                                            <td>{proc.operator}</td>
                                                            <td>{proc.mineral}</td>
                                                            <td>{proc.inputBags}</td>
                                                            <td>{proc.inputWeight}</td>
                                                            <td>{proc.outputBags}</td>
                                                            <td>{proc.outputWeight}</td>
                                                            <td>{proc.tags.split(',')[0]}</td>
                                                            <td>{proc.tagDate}</td>
                                                            <td>{proc.grade}</td>
                                                            <td>{proc.processingWeight}</td>
                                                            <td>{proc.note}</td>
                                                            <td>{proc.supplier}</td>
                                                            <td>{proc.asi}</td>
                                                            <td>{proc.lab}</td>
                                                            <td>{proc.certificate}</td>
                                                            <td>{proc.price}</td>
                                                            <td>{proc.lme}</td>
                                                            <td>{proc.tc}</td>
                                                            <td>{proc.ta}</td>
                                                            <td>{proc.unitPrice}</td>
                                                            <td>{proc.totalPrice}</td>
                                                            <td>{proc.paymentMethod}</td>
                                                            <td>{proc.security}</td>
                                                            <td>{proc.lot}</td>
                                                        </tr>)
                                                    }
                                                    {
                                                        trace.processing.length === 0 ? <tr>
                                                            <td colSpan={29}>{t("NoProcessing")}</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(procPage-1) * sort + 1} {t("To")}{" "}
                                                {trace.processing.length > procPage * sort
                                                    ? procPage*sort
                                                    : trace.processing.length}{" "}
                                                {t("Of")} {trace.processing.length} {t("Entrier")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    style={{
                                                        minWidth: '120px',  // Adjust this value as needed
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        padding: '8px 12px',  // Adjust padding to your preference
                                                        display: 'inline-block',
                                                        textAlign: 'center'
                                                    }}
                                                    onClick={() => drumsPage > 1 && setdrumsPage(drumsPage - 1)}
                                                >
                                                    {t("Previous")}
                                                </Link>
                                                    <Link
                                                        className="paginate_button next mx-4"
                                                        onClick={() =>
                                                            procPage < paggination(trace.processing).length &&
                                                            setprocPage(procPage + 1)
                                                        }
                                                    >
                                                        {t("Next")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="bags_proc" id='bags_proc'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("BagsProcessed")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>{t("TagNumber")}</th>
                                                        <th className="text-center text-dark">
                                                        {t("Weight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProcessingID")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ProductionMiningDate")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RMBRepresentativeAtMineSite")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("SecurityOfficerName")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Time")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("StorageContainer")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ColorOfThePackageContainer")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("MineralType")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Grade")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {
                                                        paginate(trace?.bags_proc, bagsProcPage, 20).map((bag, i)=><tr key={`bag${i}`}>
                                                            <td>{bag.tag}</td>
                                                            <td>{bag.weight}</td>
                                                            <td>{bag.processing}</td>
                                                            <td>{bag.date}</td>
                                                            <td>{bag.rmbRep}</td>
                                                            <td>{bag.security}</td>
                                                            <td>{bag.time}</td>
                                                            <td>{bag.storage}</td>
                                                            <td>{bag.color}</td>
                                                            <td>{bag.mineral}</td>
                                                            <td>{bag.grade}</td>
                                                        </tr>)
                                                    }{
                                                        trace?.bags_proc.length === 0 ? <tr>
                                                            <td colSpan={24}>{t("NoProcessedBags")}</td>
                                                        </tr> : <tr></tr>
                                                    }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(bagsProcPage-1) * sort + 1} {t("To")}{" "}
                                                {trace?.bags_proc.length > bagsProcPage * sort
                                                    ? bagsProcPage*sort
                                                    : trace?.bags_proc.length}{" "}
                                                {t("Of")} {trace?.bags_proc.length} {t("Entries")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                <Link
                                                    className="paginate_button previous disabled"
                                                    style={{
                                                        minWidth: '120px',  // Adjust this value as needed
                                                        whiteSpace: 'nowrap',
                                                        overflow: 'hidden',
                                                        textOverflow: 'ellipsis',
                                                        padding: '8px 12px',  // Adjust padding to your preference
                                                        display: 'inline-block',
                                                        textAlign: 'center'
                                                    }}
                                                    // to="/reviews"
                                                    onClick={() =>
                                                        bagsProcPage > 1 && setbagsProcPage(bagsProcPage - 1)
                                                    }
                                                >
                                                    {t("Previous")}
                                                </Link>
                                                <Link
                                                    className="paginate_button next mx-4"
                                                    onClick={() =>
                                                        bagsProcPage < paggination(trace?.bags_proc).length &&
                                                        setbagsProcPage(bagsProcPage + 1)
                                                    }
                                                >
                                                    {t("Next")}
                                                </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="blending" id='blending'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Blending")}</h4>
                                    </div>
                                    <div className='card-body'>
                                    {
                                        <div className="w-100 table-responsive">
                                            <div id="patientTable_basic_table" className="dataTables_wrapper">
                                                <table
                                                    id="example5"
                                                    className="display dataTable w-100 no-footer"
                                                    role="grid"
                                                    aria-describedby="example5_info"
                                                >
                                                    <thead>
                                                    <tr role="row">
                                                        { trace.blending['header'].map(header=><th
                                                            className="sorting"
                                                            tabIndex={0}
                                                            aria-controls="example5"
                                                            rowSpan={1}
                                                            colSpan={1}
                                                            style={{ width: 73 }}
                                                            key={header} 
                                                            >
                                                           {t(header)}
                                                        </th>) }
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        { trace.blending['rows'].length === 0 ? <tr>
                                                            <td colSpan={trace.blending['header'].length}>{t("NoBlendingRecords")}</td> 
                                                        </tr> :
                                                        trace.blending['rows'].map(row=><tr key={`blending-${row[0]}`}>{
                                                            row.map((field, i)=><td>
                                                            {field.includes(`Miners_Images`) ? 
                                                                <button className="btn btn-sm btn-primary" onClick={()=>showAttachment(field, trace.blending['header'][i])}>View</button> : 
                                                            field }
                                                            </td>)
                                                        }</tr>)
                                                        }
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="drums" id='drums'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Drums")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th>{t("DrumNumber")}</th>
                                                        <th className="text-center text-dark">
                                                            {t("GrossWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NetWeight")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ITSCITagNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("DrumBagColor")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Grade")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("BlendingID")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ASITagNumber")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                        {
                                                            paginate(trace.drums, drumsPage, sort).map(drum=><tr key={`drum${drum.drum}`}>
                                                                <td>{drum.drum}</td>
                                                                <td>{drum.grossWeight}</td>
                                                                <td>{drum.netWeight}</td>
                                                                <td>{drum.itsci}</td>
                                                                <td>{drum.color}</td>
                                                                <td>{drum.grade}</td>
                                                                <td>{drum.blending}</td>
                                                                <td>{drum.asi}</td>
                                                            </tr>)
                                                        }
                                                        {
                                                            trace.drums.length === 0 ? <tr>
                                                                <td colSpan={24}>{t("NoDrums")}</td>
                                                            </tr> : <tr></tr>
                                                        }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(drumsPage-1) * sort + 1} {t("To")}{" "}
                                                {trace.drums.length > drumsPage * sort
                                                    ? drumsPage*sort
                                                    : trace.drums.length}{" "}
                                               {t("Of")} {trace.drums.length} {t("Entries")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                    <Link
                                                        className="paginate_button previous disabled"
                                                        style={{
                                                            minWidth: '120px',  // Adjust this value as needed
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            padding: '8px 12px',  // Adjust padding to your preference
                                                            display: 'inline-block',
                                                            textAlign: 'center'
                                                        }}
                                                        
                                                        onClick={() =>
                                                            drumsPage > 1 && setdrumsPage(drumsPage - 1)
                                                        }
                                                    >
                                                        {t("Previous")}
                                                    </Link>
                                                    <Link
                                                        className="paginate_button next mx-4"
                                                        onClick={() =>
                                                            drumsPage < paggination(trace.drums).length &&
                                                            setdrumsPage(drumsPage + 1)
                                                        }
                                                    >
                                                        {t("Next")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                            </> : 
                            <Tab.Pane eventKey="purchase" id='purchase'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Purchase")}</h4>
                                    </div>
                                    <div className='card-body'>
                                    {
                                        <div className="w-100 table-responsive">
                                            <div id="patientTable_basic_table" className="dataTables_wrapper">
                                                <Table bordered striped hover responsive size='sm'>
                                                    <thead>
                                                    <tr role="row">
                                                        { trace.purchases['header'].map(header=><th
                                                            className="sorting"
                                                            tabIndex={0}
                                                            aria-controls="example5"
                                                            rowSpan={1}
                                                            colSpan={1}
                                                            style={{ width: 73 }}
                                                            key={header}
                                                            >
                                                            {t(header)}
                                                        </th>) }
                                                    </tr>
                                                    </thead>
                                                    <tbody>
                                                        { trace.purchases['rows'].length === 0 ? <tr>
                                                            <td colSpan={trace.purchases['header'].length}>{t("NoPurchaseRecords")}</td> 
                                                        </tr> :
                                                        trace.purchases['rows'].map(row=><tr key={`purchase-${row[0]}`}>{
                                                            row.map((field, i)=><td>
                                                            {field.includes(`Sell_Images`) ? 
                                                                <button className="btn btn-sm btn-primary" onClick={()=>showAttachment(field, trace.purchases['header'][i])}>View</button> : 
                                                            field }
                                                            </td>)
                                                        }</tr>)
                                                        }
                                                    </tbody>
                                                </Table>
                                            </div>
                                        </div>
                                    }
                                    </div>
                                </div>
                            </Tab.Pane> }
                            <Tab.Pane eventKey="exports" id='exports'>
                                <div className='card'>
                                    <div className='card-header'>
                                        <h4 className='card-title'>{t("Exports")}</h4>
                                    </div>
                                    <div className='card-body'>
                                        <div id="soldre-view" className="dataTables_wrapper no-footer">
                                            <Table bordered striped hover responsive size='sm'>
                                                <thead>
                                                    <tr>
                                                        <th className="text-center text-dark">
                                                            {t("Date")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                            {t("MineralType")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Grade")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NetWeightKg")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("GrossWeightKg")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ExportationID")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RMBRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ExporterRepresentative")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TraceabilityAgent")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Destination")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Itinerary")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ShipmentNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ExportCertificateNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("RRACertificateNumber")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("ExportValueUSD")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Transporter")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("IDNumberOfDriver")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TruckPlateNumberFront")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TruckPlateNumberBack")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("NumberOfTags")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalGrossWeightKg")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("TotalNetWeightKg")}
                                                        </th>
                                                        <th className="text-center text-dark">
                                                        {t("Attachments")}
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                        {
                                                            paginate(trace.exports, exportsPage, sort).map(exp=><tr key={exp.exportationID}>
                                                                <td>{exp.date}</td>
                                                                <td>{exp.mineral}</td>
                                                                <td>{exp.grade}</td>
                                                                <td>{access === '3ts' ? exp.netWeight : (exp.netWeight/1000).toFixed(2)}</td>
                                                                <td>{access === '3ts' ? exp.grossWeight : (exp.grossWeight/1000).toFixed(2)}</td>
                                                                <td>{exp.exportationID}</td>
                                                                <td>{exp.rmbRep}</td>
                                                                <td>{exp.exportRep}</td>
                                                                <td>{exp.traceabilityAgent}</td>
                                                                <td>{exp.destination}</td>
                                                                <td>{exp.itinerary}</td>
                                                                <td>{exp.shipmentNumber}</td>
                                                                <td>{exp.exportCert}</td>
                                                                <td>{exp.rraCert}</td>
                                                                <td>{exp.value}</td>
                                                                <td>{exp.transporter}</td>
                                                                <td>{exp.driverID}</td>
                                                                <td>{exp.truckFrontPlate}</td>
                                                                <td>{exp.truckBackPlate}</td>
                                                                <td>{exp.tags}</td>
                                                                <td>{exp.totalGrossWeight}</td>
                                                                <td>{exp.totalNetWeight}</td>
                                                                <td><Link to={`/exports/${exp.id}`}>View Attachments</Link></td>
                                                            </tr>)
                                                        }
                                                        {
                                                            trace.exports.length === 0 ? <tr>
                                                                <td colSpan={24}>{t("NoExports")}</td>
                                                            </tr> : <tr></tr>
                                                        }
                                                </tbody>
                                            </Table>
                                            <div className="d-sm-flex text-center justify-content-between align-items-center mt-3">
                                                <div className="dataTables_info">
                                                {t("Showing")} {(exportsPage-1) * sort + 1} {t("To")}{" "}
                                                {(trace.exports.length > exportsPage * sort
                                                    ? exportsPage*sort
                                                    : trace.exports.length)}{" "}
                                                {t("Of")} {trace.exports.length} {t("Entries")}
                                                </div>
                                                <div
                                                    className="dataTables_paginate paging_simple_numbers"
                                                    id="example2_paginate"
                                                >
                                                    <Link
                                                        className="paginate_button previous disabled"
                                                        style={{
                                                            minWidth: '120px',  // Adjust this value as needed
                                                            whiteSpace: 'nowrap',
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            padding: '8px 12px',  // Adjust padding to your preference
                                                            display: 'inline-block',
                                                            textAlign: 'center'
                                                        }}
                                                        onClick={() =>
                                                            exportsPage > 1 && setexportsPage(exportsPage - 1)
                                                        }
                                                    >
                                                        {t("Previous")}
                                                    </Link>
                                                    <Link
                                                        className="paginate_button next mx-4"
                                                        onClick={() =>
                                                            exportsPage < paggination(trace.exports).length &&
                                                            setexportsPage(exportsPage + 1)
                                                        }
                                                    >
                                                        {t("Next")}
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Tab.Pane>
                        </Tab.Content>
                    </Tab.Container>
                    </div> : <div className='row'>
                    <div className='col-md-6'>
                        <div className='card'>
                            <div className='card-header'>
                            <h5 className='card-title'>{t("SelectCompany")}</h5>
                            </div>
                            <div className='card-body'>
                                    <select onChange={changeCompany} className='form-control'>
                                        <option>{t("SelectCompanyShort")}</option>
                                        { companies.map(company=><option value={JSON.stringify(company)}>{company.name}</option>) }
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
                :
                <div>
                </div>
                }
            </div>
        </>
    );
};


export default Reports;