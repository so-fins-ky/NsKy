 
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

var app = new Framework7({
    // App root element
    root: '#app',
    // App Name
    name: 'LoveNotes',
    // App id
    id: 'com.myapp.test',
    // Panel deslizable jeje
    panel: {
      swipe: 'left',
    },
    // Rutas de acceso a las diferentes pantallas
    routes: [
		{
		path: '/calendar-page/',
		url: 'calendar-page.html',
		},
      {
        path: '/about/',
        url: 'about.html',
      },
	  {
        path: '/diario/',
        url: 'Diario.html',
      }, {
        path: '/vinculos/',
        url: 'Vinculos.html',
      }, {
        path: '/suenos/',
        url: 'suenos.html',
      },{
        path: '/config/',
        url: 'config.html',
      }, {
        path: '/todo/',
        url: 'todo.html',
      },
	  {
        path: '/index/',
        url: 'index.html',
      },{
        path: '/suenosDiario/',
        url: 'suenosDiario.html',
      },
    ]
    // ... Otros parametros very importantes jeje
  });

var mainView = app.views.create('.view-main');
var calendar = app.calendar.create({
    inputEl: '#calendar-input'
});

// Listo Cordova, apenas entramos a la app lo primero que hace
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
	
	
	
});

// Option 1. Using one 'page:init' handler for all pages
$$(document).on('page:init', function (e) {
});

// Option 2. Using live 'page:init' event handlers for each page
$$(document).on('page:init', '.page[data-name="index"]', function (e) {
var arrayFrases =["Mereces lo que sueñas", "Come sano respira amor", "Nunca es tarde para ser feliz", "Nunca te rindas"];
 function fnVisibleOrNot () {
		 if ($$("#editorFrases").hasClass("invisible"))
		{ 
		$$("#editorFrases").removeClass("invisible").addClass("visible");
		}else {
		$$("#editorFrases").removeClass("visible").addClass("invisible");
		}
	   }
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
	//FrasesRandom
$$("#frasesRandom").on("click", fnFrasesRandom); 
  
  function fnFrasesRandom(){	  
	  let rand = Math.floor((Math.random()* arrayFrases.length)+1);
	 console.log("la frase es" + arrayFrases[rand])
	 $$("#frasesRandom").html('"'+arrayFrases[rand]+'"');
  }
  
  //agrega una frase random
  $$("#create").on("click", fnAgregaFrasesRandom); 
   function fnAgregaFrasesRandom(){
	   fnVisibleOrNot();
	  // $$("#editorFrases").html("Funciono");
	   console.log("funciono dar click"); 
		}
	   $$("#btnOkFrase").on("click", fnAgregarFrase);
	   function fnAgregarFrase () {
	   fnVisibleOrNot();
		  	   var textoAgregado = $$("#boxTextoFrase").html();
		   console.log("funciona el boton");
		   arrayFrases.push(textoAgregado);
		   $$("#boxTextoFrase").html("");
		   console.log(textoAgregado);
		
	   }
	  
  
	
	
	//botonera
      $$("#btnDiario").on("click", navegaDiario);  
	  $$("#btnVinculos").on("click", navegaVinculos);  
	  $$("#btnSuenos").on("click", navegaSuenos);  
	  $$("#btnToDo").on("click", navegaToDo);
	  
	 
	function navegaDiario () { mainView.router.navigate('/diario/')}
	function navegaVinculos () { mainView.router.navigate('/vinculos/')}
	function navegaSuenos () { mainView.router.navigate('/suenos/')}
	function navegaToDo () { mainView.router.navigate('/todo/')}
})

//calendar

$$(document).on('page:init', '.page[data-name="todo"]', function (e) {
	
	
});

//calendar
$$(document).on('page:init', '.page[data-name="calendar-page"]', function (e) {
var monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  var calendarInline = app.calendar.create({
					
        containerEl: '#demo-calendar-inline-container',
        value: [new Date()],
        renderToolbar: function () {
          return '<div class="toolbar calendar-custom-toolbar no-shadow">' +
            '<div class="toolbar-inner">' +
            '<div class="left">' +
            '<a  class="link icon-only"><i class="icon icon-back"></i></a>' +
            '</div>' +
            '<div class="center"></div>' +
            '<div class="right">' +
            '<a  class="link icon-only"><i class="icon icon-forward"></i></a>' +
            '</div>' +
            '</div>' +
            '</div>';
        },
        on: {
          init: function (c) {
            $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
            $$('.calendar-custom-toolbar .left .link').on('click', function () {
              calendarInline.prevMonth();
            });
            $$('.calendar-custom-toolbar .right .link').on('click', function () {
              calendarInline.nextMonth();
            });

          },
          monthYearChangeStart: function (c) {
            $$('.calendar-custom-toolbar .center').text(monthNames[c.currentMonth] + ', ' + c.currentYear);
          }
        }
    });
   /*  $$("#cruz").on("click", calendarInline.destroy()) */ 


		
     
	
});





$$(document).on('page:init', '.page[data-name="suenos"]', function (e) {
    // Do something here when page with data-name="about" attribute loaded and initialized
    console.log(e);
      $$("#btnNuevaNota").on("click", eNavigate);
	 $$("#btnDiarioSuenos").on("click", fnVerDiarioSuenos)
	 function fnVerDiarioSuenos(){
		 mainView.router.navigate('/suenosDiario/') 
		 
	 }
		function eNavigate () {
	  
	  mainView.router.navigate('/index/')
}
})
 
//añadiendo animaciones


 
 
 

/* 
function fnObservador(){
 firebase.auth().onAuthStateChanged((user) => {
  if (user) {
   mainView.router.navigate('/home/');
   $$("#miNick").html(user.displayName);
   $$("#miFotoPerfil").attr("src", user.photoURL);
$$("#appBar").removeClass("oculto").addClass("visible")
    var uid = user.uid;
	console.log("el usuario actual es " + uid);
	$$("#currentUserSaludo").html(user.displayName);
  } else {
	 mainView.router.navigate('/registro/');
	    $$("#appBar").removeClass("visible").addClass("oculto")
  
  }
});
 } */