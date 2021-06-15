function sourceFunction(x, F) {
  return (eval(F))
}


function elementDelete(){
  let e = window.event
  $(e.target).parent().remove()   
  console.log($(e.target)) 
}


function saveCanvas(){
  var cvs = document.getElementById("popChart");
  var image = new Image();
  image.src = cvs.toDataURL("image/jpg");
  image.crossOrigin = "anonymous";
  var link = document.createElement("a");
  link.href = image.src;
  link.download = "graphs.jpg";
  link.click();
}


let data = []
let min = -5;
let max = 5;
let zoom = 0;
let step = 0.1;
let offset = 0;
var ticksArray = [];
let datapoints = [];

function findEdges(minArray, maxArray){
  let mins = []
  let maxs = []

  for(let i = 0; i<minArray.length; i++){
    mins.push(parseInt($(minArray[i]).val()))
  }
  for(let i = 0; i<maxArray.length; i++){
    maxs.push(parseInt($(maxArray[i]).val()))
  }
  console.log(mins, maxs)
  console.log(Math.min(...mins), Math.max(...maxs))
  return [Math.min(...mins), Math.max(...maxs), mins, maxs]
}


function createF(a, exp) {
  return eval(exp)
}


function replacer(to_replace) {
  return String(to_replace)
    .replaceAll("x", '`${x}`')
    .replaceAll("^", '**')
    .replaceAll("sin", 'Math.sin')
    .replaceAll("cos", 'Math.cos')
    .replaceAll("tg", 'Math.tan')
    .replaceAll('pi', 'Math.PI')
    .replaceAll('sqrt', 'Math.sqrt')
    .replaceAll('abs', 'Math.abs')
}
let elemToAppend = `
  <div class='input_wrapper'>
    <input value='x^2' class='expression' type='text'>
    <i class='material-icons delete'>close</i>
  </div>
  <div class="input_wrapper edges">
    <input value="-5" class='since' type="text">
    <input value="5" class='to' type="text">
  </div>`

let mainSince = -5;
let mainTo = 5;
let colors = ['#cdc5c2','#332d2a','#B22222','#32CD32','#FFD700','#8B008B','#000000','#FF00FF', '#696969','#191970','#7FFFD4','#BDB76B','#2F4F4F','#000080']


$('.modal').on('click', function(e){
  if (e.target==this){
    $('.modal').removeClass('show_modal')
  }
})


$('.modal_close').on('click', function(e){
  $('.modal').removeClass('show_modal')
})


$(() => {
  var popCanvas = $("#popChart");
  var popCanvas = document.getElementById("popChart");
  var popCanvas = document.getElementById("popChart").getContext("2d");

  let data = {
    labels: [],
    datasets: []
  };

  const DISPLAY = true;
  const BORDER = true;
  const CHART_AREA = true;
  const TICKS = true;

  const config = {
    type: 'line',
    data: data,
    options: {
      animation:{
        duration: 0,
      },
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'График уравнения'
        },
      },
      interaction: {
        intersect: false,
      },
      radius: 0,
      scales: {
        x: {
          display: true,
          title: {
            display: true
          },
          grid: {
            display: DISPLAY,
            drawBorder: BORDER,
            drawOnChartArea: CHART_AREA,
            drawTicks: TICKS,
          }
        },
        y: {
          borderColor: 'rgba(0, 0, 0, 1)',
          display: true,
          grid: {
            display: DISPLAY,
            drawBorder: BORDER,
            drawOnChartArea: CHART_AREA,
            drawTicks: TICKS,
          },
          title: {
            display: true,
            text: 'Value',
          },
          suggestedMin: -1,
          suggestedMax: 2,

        }
      }
    },
  };

  var barChart = ''

  $('.plus').on('click', ()=>{
    $('.plus').before(elemToAppend)    
    document.querySelectorAll('.delete').forEach((element, index) => {
      if (index != 0){
        element.onclick=elementDelete
      }
    });
  })
  $('.save').click(()=>{
    saveCanvas()
  })
  document.onkeydown = (e)=>{
    if ( e.ctrlKey && ( e.which === 83 ) ) {
      e.preventDefault()
      saveCanvas()
      return false
    }
  }
  let show_full = ()=>{
    $('.modal').addClass('show_modal')
    var cvs = document.getElementById("popChart");
    var image = new Image();
    image.src = cvs.toDataURL("image/jpg");
    image.crossOrigin = "anonymous";
    $('.modal_image').attr('src', image.src )
  }


  $('.look_full').on('click',()=>{
    show_full()
  })


  $('.show_desctop').on('click',()=>{
    show_full()
  })


  $('.sub').on('click', () => {
    reload()
  })


  $('.offset_less').on('click', function(e){
    console.log((Math.abs(min)+Math.abs(max))/10)
    offset-=(Math.abs(min+offset+zoom)+Math.abs(min-offset+zoom))/50;
    reload()
  })


  $('.offset_more').on('click', function(e){
    offset+=(Math.abs(min+offset+zoom)+Math.abs(min-offset+zoom))/50;
    reload()
  })
  $('.zoom_in').on('click', function(e){
    if(step>0.01) step/=2
    zoom += 0.5
    reload()
  })


  $('.zoom_out').on('click', function(e){
    if(step<=0.1) step*=2
    zoom -= 0.5
    reload()
  })


  
  let reload = () => {
    $('.look_full').removeClass('no_show')
    $('.show_desctop').removeClass('no_show')
    $('.sub').val('Перерисовать')
    $('canvas').remove();
    $('.canvas_info').remove();
    $('.canvas_wrapper').append('<canvas id="popChart"></canvas>')
    popCanvas = $("#popChart");
    popCanvas = document.getElementById("popChart").getContext("2d");
    let exp = Array.from($('.expression'))
    let sinceArray = Array.from($('.since'))
    let toArray = Array.from($('.to'))
    let [mainSince, mainTo, sinceVals, toVals] = findEdges(sinceArray, Array.from($('.to')))
    console.log(mainSince, mainTo)
    console.log(sinceArray, toArray)
    let expList = []
    for (let i of exp) {
      expList.push(replacer($(i).val()))
    }
    data.datasets = []
    data.labels = []
    generator(mainSince+offset+zoom, mainTo+offset-zoom, step, exp)
    barChart = new Chart(popCanvas, config);
    function generator(min = -5, max = 5, step = 0.1, F) {
      let y = min;
      for (let k = 0; k < exp.length; k++) {
        data.datasets.push({
          data: [],
          label: $(exp[k]).val(),
          borderColor: colors[k],
          borderWidth: 2
        })
        
        for (let y = min; y < max; y += step) {
          if(y>=sinceVals[k]-step && y<=toVals[k]+step){
              data.datasets[k].data.push(
              sourceFunction(y, expList[k]),
            )
          }
          else{
            data.datasets[k].data.push(
              null
            )
          }
         
        }
      }
      for (let i = min; i <= max; i += step) {
        data.labels.push(i.toFixed(2));
        ticksArray.push(i.toFixed(2))
      }
    }
  }
})