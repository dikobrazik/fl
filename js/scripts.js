var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction; 
var db, storeName = 'database';
function connectDB(f){
    var request = indexedDB.open(storeName, 1);
    request.onerror = function(err){
        console.log(err);
    };
    request.onsuccess = function(){
        // При успешном открытии вызвали коллбэк передав ему объект БД
        f(request.result);
    }
    request.onupgradeneeded = function(e){
        // Если БД еще не существует, то создаем хранилище объектов.
        e.currentTarget.result.createObjectStore(storeName, {  keyPath: "id", autoIncrement:true });
        connectDB(f);
    }
}

function get(index){
    connectDB(function(index){
        var index = objectStore.index("name");
        index.get("Donna").onsuccess = function(event) {
            alert("Donna's SSN is " + event.target.result.ssn);
        };
    })
}

function list(f){
    connectDB(function(db){
		var rows = [],
			store = db.transaction([storeName], "readonly").objectStore(storeName);

		if(store.mozGetAll)
			store.mozGetAll().onsuccess = function(e){
				f(e.target.result);
			};
		else
			store.openCursor().onsuccess = function(e) {
				var cursor = e.target.result;
				if(cursor){
					rows.push(cursor.value);
					cursor.continue();
				}
				else {
					f(rows);
				}
			};
	});
}
function add(data){
    connectDB(function(db){
		var request = db.transaction([storeName], "readwrite").objectStore(storeName).put(data);
		request.onsuccess = function(){
			return request.result;
		}
	});
}

var generalInformation = `<div class="input-group my-2 p-0">
<div class="input-group-append col-4 p-0">
  <button class="btn btn-outline-secondary dropdown-toggle col" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Показатель</button>
  <div class="dropdown-menu col p-0" id="myDropdown">
  <input type="text" id="searchInput" class="form-control p-2" onkeyup="filterFunction()" aria-label="Text input with dropdown button" placeholder="Search..">
    <a class="dropdown-item" onclick="btnName(this)">Дата госп-и</a>
    <a class="dropdown-item" onclick="btnName(this)">койко-день</a>
    <a class="dropdown-item" onclick="btnName(this)">возраст</a>
    <a class="dropdown-item" onclick="btnName(this)">пол</a>
    <a class="dropdown-item" onclick="btnName(this)">Диагноз ЛОП/СОП/ТОП</a>
    <a class="dropdown-item" onclick="btnName(this)">диагноз ОП/ИПН/СПН/ХП</a>
    <a class="dropdown-item" onclick="btnName(this)">осложнения</a>
    <a class="dropdown-item" onclick="btnName(this)">Вид операции</a>
    <a class="dropdown-item" onclick="btnName(this)">сопутств.заб.</a>
    <a class="dropdown-item" onclick="btnName(this)">этиология</a>
    <a class="dropdown-item" onclick="btnName(this)">исход</a>
    <a class="dropdown-item" onclick="btnName(this)">Ranson</a>
    <a class="dropdown-item" onclick="btnName(this)">ССВР</a>
    <a class="dropdown-item" onclick="btnName(this)">None</a>
    <a class="dropdown-item" onclick="btnName(this)">М-APACHE II</a>
    <a class="dropdown-item" onclick="btnName(this)">к/день в ОАРИТ</a>
    <a class="dropdown-item" onclick="btnName(this)">№сутки в ОАРИТ</a>
    <a class="dropdown-item" onclick="btnName(this)">нач.заб.,час</a>
    <a class="dropdown-item" onclick="btnName(this)">тип госпитализации</a>
    <a class="dropdown-item" onclick="btnName(this)">Сутки перевода</a>
    <a class="dropdown-item" onclick="btnName(this)">№ госп-и</a>
    <a class="dropdown-item" onclick="btnName(this)">ранн.опер.</a>
    <a class="dropdown-item" onclick="btnName(this)">расп.боли</a>
    <a class="dropdown-item" onclick="btnName(this)">нарк.анальг.</a>
    <a class="dropdown-item" onclick="btnName(this)">мн.рвота</a>
    <a class="dropdown-item" onclick="btnName(this)">рв.коф.гущ.</a>
    <a class="dropdown-item" onclick="btnName(this)">BMI</a>
    <a class="dropdown-item" onclick="btnName(this)">c-м Грея-К.</a>
    <a class="dropdown-item" onclick="btnName(this)">Группа крови</a>
    <a class="dropdown-item" onclick="btnName(this)">Rh</a>
    <a class="dropdown-item" onclick="btnName(this)">ЭКГ</a>
    <a class="dropdown-item" onclick="btnName(this)">None</a>
    <a class="dropdown-item" onclick="btnName(this)">эффект от леч. 24 часа</a>
    <a class="dropdown-item" onclick="btnName(this)">антибак.проф.</a>
    <a class="dropdown-item" onclick="btnName(this)">антиферм.</a>
    <a class="dropdown-item" onclick="btnName(this)">антисекр.преп.</a>
    <a class="dropdown-item" onclick="btnName(this)">гемосорб.</a>
    <a class="dropdown-item" onclick="btnName(this)">СДК</a>
    <a class="dropdown-item" onclick="btnName(this)">нутр.подд-ка.</a>
    <a class="dropdown-item" onclick="btnName(this)">дрен.УЗ-контр</a>
    <a class="dropdown-item" onclick="btnName(this)">лап.(леч.)</a>
    <a class="dropdown-item" onclick="btnName(this)">ЭПСТ</a>
    <a class="dropdown-item" onclick="btnName(this)">ПКТ</a>
    <a class="dropdown-item" onclick="btnName(this)">ТИАБ(диагн)</a>
    <a class="dropdown-item" onclick="btnName(this)">миниинваз.оп.</a>
    <a class="dropdown-item" onclick="btnName(this)">лапаротомий-всего</a>
    <a class="dropdown-item" onclick="btnName(this)">Примечание</a>
    <a class="dropdown-item" onclick="btnName(this)">ОЦЕНКА</a>
  </div>
</div>
<input type="text" class="form-control" aria-label="Text input with dropdown button">

</div>`
function filterFunction() {
    var input, filter, ul, li, a, i;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    div = document.getElementById("myDropdown");
    a = div.getElementsByTagName("a");
    for (i = 0; i < a.length; i++) {
      txtValue = a[i].textContent || a[i].innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        a[i].style.display = "";
      } else {
        a[i].style.display = "none";
      }
    }
  }
// var generalInformationArray = ['Дата госп-и', 'койко-день', 'возраст', 'пол', 'Диагноз ЛОП/СОП/ТОП', 'диагноз ОП/ИПН/СПН/ХП', 'осложнения', 'Вид операции', 'сопутств.заб.', 'этиология', 'исход', 'Ranson', 'ССВР', 'None', 'М-APACHE II', 'к/день в ОАРИТ', '№сутки в ОАРИТ', 'нач.заб.,час', 'тип госпитализации', 'Сутки перевода', '№ госп-и', 'ранн.опер.', 'расп.боли', 'нарк.анальг.', 'мн.рвота', 'рв.коф.гущ.', 'BMI', 'c-м Грея-К.', 'Группа крови', 'Rh', 'ЭКГ', 'None', 'эффект от леч. 24 часа', 'антибак.проф.', 'антиферм.', 'антисекр.преп.', 'гемосорб.', 'СДК', 'нутр.подд-ка.', 'дрен.УЗ-контр', 'лап.(леч.)', 'ЭПСТ', 'ПКТ', 'ТИАБ(диагн)', 'миниинваз.оп.', 'лапаротомий-всего', 'Примечание', 'ОЦЕНКА',]