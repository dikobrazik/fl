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
/**
 * 
 * @param {number} id - id пациента в бд
 * @return {Object} - возвращает данные о пациенте 
 */
function get(id){
    connectDB(function(db){
      var request = db.transaction([storeName], "readwrite")
                  .objectStore(storeName).get(Number(id));
      request.onsuccess = function(event) {
        fillAllFields(event.currentTarget.result)
      };
    })
}
function remove(id){
  connectDB(function(db){
    var request = db.transaction([storeName], "readwrite")
                  .objectStore(storeName).delete(id);
    request.onsuccess = function(event) {
      if(event.type == 'success') alert('Успешно')
      else alert('Возникла проблема...')
    };
    request.onerror = function(event) {
      alert(event)
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

var generalInformation = `<div class="input-group mb-3 p-0">
<div class="input-group-append col-4 p-0">
  <button class="btn btn-outline-secondary dropdown-toggle col rounded" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Показатель</button>
  <div class="dropdown-menu col p-0 rounded" id="myDropdown">
  <input type="text" id="searchInput" class="form-control p-2 searchInput rounded" onkeyup="filterFunction(this)" aria-label="Text input with dropdown button" placeholder="Search..">
    <a class="dropdown-item" onclick="btnName(this)">койко-день</a>
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
<input type="text" class="form-control added-data-field" aria-label="Text input with dropdown button">

</div>`;

var generalPeriodInformation = 
`
<div class="input-group mb-3 p-0">
<div class="input-group-append col-4 p-0">
  <button class="btn btn-outline-secondary dropdown-toggle col rounded" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Показатель</button>
  <div class="dropdown-menu col p-0 rounded" id="myDropdown">
  <input type="text" id="searchInput" class="form-control p-2 searchInput rounded" onkeyup="filterFunction(this)" aria-label="Text input with dropdown button" placeholder="Search..">
<a class="dropdown-item" onclick="btnName(this)">темп.тела</a>
<a class="dropdown-item" onclick="btnName(this)">част.пульса</a>
<a class="dropdown-item" onclick="btnName(this)">АДсист.</a>
<a class="dropdown-item" onclick="btnName(this)">вазопресс.</a>
<a class="dropdown-item" onclick="btnName(this)">част. дых.</a>
<a class="dropdown-item" onclick="btnName(this)">сатурация</a>
<a class="dropdown-item" onclick="btnName(this)">ИВЛ</a>
<a class="dropdown-item" onclick="btnName(this)">диурез,мл</a>
<a class="dropdown-item" onclick="btnName(this)">сознание</a>
<a class="dropdown-item" onclick="btnName(this)">зонд,мл</a>
<a class="dropdown-item" onclick="btnName(this)">вздутие ж.</a>
<a class="dropdown-item" onclick="btnName(this)">ОЖО или св.ж.</a>
<a class="dropdown-item" onclick="btnName(this)">ЦВД,мм вод.</a>
<a class="dropdown-item" onclick="btnName(this)">лапарос.диагн.</a>
<a class="dropdown-item" onclick="btnName(this)">ЭФГДС</a>
<a class="dropdown-item" onclick="btnName(this)">УЗИ</a>
<a class="dropdown-item" onclick="btnName(this)">КТ</a>
<a class="dropdown-item" onclick="btnName(this)">посев крови</a>
<a class="dropdown-item" onclick="btnName(this)">посев ОЖО</a>
<a class="dropdown-item" onclick="btnName(this)">имм.статус</a>
<a class="dropdown-item" onclick="btnName(this)">эритр.</a>
<a class="dropdown-item" onclick="btnName(this)">Hb</a>
<a class="dropdown-item" onclick="btnName(this)">Ht</a>
<a class="dropdown-item" onclick="btnName(this)">СОЭ</a>
<a class="dropdown-item" onclick="btnName(this)">лейк.</a>
<a class="dropdown-item" onclick="btnName(this)">тромбоциты, кол-во</a>
<a class="dropdown-item" onclick="btnName(this)">тромбоциты, объем</a>
<a class="dropdown-item" onclick="btnName(this)">п/ядерн.</a>
<a class="dropdown-item" onclick="btnName(this)">лимфоциты</a>
<a class="dropdown-item" onclick="btnName(this)">нейтрофилы</a>
<a class="dropdown-item" onclick="btnName(this)">ЛИИ</a>
<a class="dropdown-item" onclick="btnName(this)">глюкоза</a>
<a class="dropdown-item" onclick="btnName(this)">белок</a>
<a class="dropdown-item" onclick="btnName(this)">АлАТ</a>
<a class="dropdown-item" onclick="btnName(this)">АсАТ,</a>
<a class="dropdown-item" onclick="btnName(this)">билир.</a>
<a class="dropdown-item" onclick="btnName(this)">ЩФ</a>
<a class="dropdown-item" onclick="btnName(this)">ГГТП</a>
<a class="dropdown-item" onclick="btnName(this)">мочевина</a>
<a class="dropdown-item" onclick="btnName(this)">креатинин</a>
<a class="dropdown-item" onclick="btnName(this)">амилаза мочи</a>
<a class="dropdown-item" onclick="btnName(this)">амилаза крови</a>
<a class="dropdown-item" onclick="btnName(this)">кальций</a>
<a class="dropdown-item" onclick="btnName(this)">ЛДГ</a>
<a class="dropdown-item" onclick="btnName(this)">СРБ</a>
<a class="dropdown-item" onclick="btnName(this)">рН</a>
<a class="dropdown-item" onclick="btnName(this)">рСО2</a>
<a class="dropdown-item" onclick="btnName(this)">рО2</a>
<a class="dropdown-item" onclick="btnName(this)">НСО3</a>
<a class="dropdown-item" onclick="btnName(this)">tCO2</a>
<a class="dropdown-item" onclick="btnName(this)">ABE</a>
<a class="dropdown-item" onclick="btnName(this)">SO2</a>
<a class="dropdown-item" onclick="btnName(this)">АЧТВ</a>
<a class="dropdown-item" onclick="btnName(this)">ПИ</a>
<a class="dropdown-item" onclick="btnName(this)">МНО</a>
<a class="dropdown-item" onclick="btnName(this)">PROMISE</a>
</div>
</div>
<input type="text" class="form-control added-data-field" aria-label="Text input with dropdown button">

</div>`;
function filterFunction(data) {
    var input, filter, a, i;
    input = data;
    filter = input.value.toUpperCase();
    div = data.parentElement.parentElement.parentElement.parentElement;
    
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
var generalInformationArray = ['Дата госп-и', 'койко-день', 'возраст', 'пол', 'Диагноз ЛОП/СОП/ТОП', 'диагноз ОП/ИПН/СПН/ХП', 'осложнения', 'Вид операции', 'сопутств.заб.', 'этиология', 'исход', 'Ranson', 'ССВР', 'None', 'М-APACHE II', 'к/день в ОАРИТ', '№сутки в ОАРИТ', 'нач.заб.,час', 'тип госпитализации', 'Сутки перевода', '№ госп-и', 'ранн.опер.', 'расп.боли', 'нарк.анальг.', 'мн.рвота', 'рв.коф.гущ.', 'BMI', 'c-м Грея-К.', 'Группа крови', 'Rh', 'ЭКГ', 'None', 'эффект от леч. 24 часа', 'антибак.проф.', 'антиферм.', 'антисекр.преп.', 'гемосорб.', 'СДК', 'нутр.подд-ка.', 'дрен.УЗ-контр', 'лап.(леч.)', 'ЭПСТ', 'ПКТ', 'ТИАБ(диагн)', 'миниинваз.оп.', 'лапаротомий-всего', 'Примечание', 'ОЦЕНКА',]
var periodInformationArray = ['темп.тела', 'част.пульса', 'АДсист.', 'вазопресс.', 'част. дых.', 'сатурация', 'ИВЛ', 'диурез,мл', 'сознание', 'зонд,мл', 'вздутие ж.', 'ОЖО или св.ж.', 'ЦВД,мм вод.', 'лапарос.диагн.', 'ЭФГДС', 'УЗИ', 'КТ', 'посев крови', 'посев ОЖО', 'имм.статус', 'эритр.', 'Hb', 'Ht', 'СОЭ', 'лейк.', 'тромбоциты, кол-во', 'тромбоциты, объем', 'п/ядерн.', 'лимфоциты', 'нейтрофилы', 'ЛИИ', 'глюкоза', 'белок', 'АлАТ', 'АсАТ,', 'билир.', 'ЩФ', 'ГГТП', 'мочевина', 'креатинин', 'амилаза мочи', 'амилаза крови', 'кальций', 'ЛДГ', 'СРБ', 'рН', 'рСО2', 'рО2', 'НСО3', 'tCO2', 'ABE', 'SO2', 'АЧТВ', 'ПИ', 'МНО', 'PROMISE',]
transliterate = (
	function() {
		var
			rus = "щ   ш  ч  ц  ю  я  ё  ж  ъ  ы  э  а б в г д е з и й к л м н о п р с т у ф х ь".split(/ +/g),
			eng = "shh sh ch cz yu ya yo zh `` y' e` a b v g d e z i j k l m n o p r s t u f x `".split(/ +/g)
		;
		return function(text, engToRus) {
			var x;
			for(x = 0; x < rus.length; x++) {
				text = text.split(engToRus ? eng[x] : rus[x]).join(engToRus ? rus[x] : eng[x]);
				text = text.split(engToRus ? eng[x].toUpperCase() : rus[x].toUpperCase()).join(engToRus ? rus[x].toUpperCase() : eng[x].toUpperCase());	
			}
			return text;
		}
	}
)();
