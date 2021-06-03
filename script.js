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
var ticksArray = [];
let datapoints = [];
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
let colors = ['#cdc5c2','#332d2a','#B22222','#32CD32','#FFD700','#8B008B','#000000','#FF00FF', '#696969','#191970','#7FFFD4','#BDB76B','#2F4F4F','#000080']
$('.modal').on('click', function(e){
  console.log(this, e.target)
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
    $('.plus').before("<div class='input_wrapper'><input value='x^2' class='expression' type='text'><i class='material-icons delete'>close</i></div>")    
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
    $('.look_full').removeClass('no_show')
    $('.show_desctop').removeClass('no_show')
    $('.sub').val('Перерисовать')
    $('canvas').remove();
    $('.canvas_info').remove();
    $('.canvas_wrapper').append('<canvas id="popChart"></canvas>')
    popCanvas = $("#popChart");
    popCanvas = document.getElementById("popChart").getContext("2d");
    let exp = Array.from($('.expression'))
    let expList = []
    for (let i of exp) {
      expList.push(replacer($(i).val()))
    }
    data.datasets = []
    data.labels = []
    generator(-5, 5, 0.1, exp)
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
          data.datasets[k].data.push(
            sourceFunction(y, expList[k]),
          )
        }
      }
      for (let i = min; i <= max; i += step) {
        data.labels.push(i.toFixed(2));
        ticksArray.push(i.toFixed(2))
      }
    }
  })


})