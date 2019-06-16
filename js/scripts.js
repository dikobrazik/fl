var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction; 
var db, storeName = 'database';
var toggleStore = () => storeName = storeName=='database'?'settings':'database';
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
 * @param {function} func - callback в которую передается поле с id
 */
function get(id, func){
    connectDB(function(db){
      var request = db.transaction([storeName], "readwrite")
                  .objectStore(storeName).get(Number(id));
      request.onsuccess = function(event) {
        func(event.currentTarget.result)
      };
    })
}
function remove(id){
  connectDB(function(db){
    var request = db.transaction([storeName], "readwrite")
                  .objectStore(storeName).delete(id);
    request.onsuccess = function(event) {
      // if(event.type == 'success') alert('Успешно')
      // else alert('Возникла проблема...')
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
    connectDB( function(db){
    var request = db.transaction([storeName], "readwrite").objectStore(storeName).put(data);
		request.onsuccess = function(e){
            // console.log('added')
			id = request.result;
		}
	});
}
var generalInformationArray = ['Дата госп-и', 'койко-день', 'возраст', 'пол', 'Диагноз ЛОП/СОП/ТОП', 'диагноз ОП/ИПН/СПН/ХП', 'осложнения', 'Вид операции', 'сопутств.заб.', 'этиология', 'исход', 'Ranson', 'ССВР','', 'М-APACHE II', 'к/день в ОАРИТ', '№сутки в ОАРИТ', 'нач.заб.,час', 'тип госпитализации', 'Сутки перевода', '№ госп-и', 'ранн.опер.', 'расп.боли', 'нарк.анальг.', 'мн.рвота', 'рв.коф.гущ.', 'BMI', 'c-м Грея-К.', 'Группа крови', 'Rh', 'ЭКГ', 'эффект от леч. 24 часа', 'антибак.проф.', 'антиферм.', 'антисекр.преп.', 'гемосорб.', 'СДК', 'нутр.подд-ка.', 'дрен.УЗ-контр', 'лап.(леч.)', 'ЭПСТ', 'ПКТ', 'ТИАБ(диагн)', 'миниинваз.оп.', 'лапаротомий-всего', 'Примечание', 'ОЦЕНКА',]
var periodInformationArray = ['темп.тела', 'част.пульса', 'АДсист.', 'вазопресс.', 'част. дых.', 'сатурация', 'ИВЛ', 'диурез,мл', 'сознание', 'зонд,мл', 'вздутие ж.', 'ОЖО или св.ж.', 'ЦВД,мм вод.', 'лапарос.диагн.', 'ЭФГДС', 'УЗИ', 'КТ', 'посев крови', 'посев ОЖО', 'имм.статус', 'эритр.', 'Hb', 'Ht', 'СОЭ', 'лейк.', 'тромбоциты, кол-во', 'тромбоциты, объем', 'п/ядерн.', 'лимфоциты', 'нейтрофилы', 'ЛИИ', 'глюкоза', 'белок', 'АлАТ', 'АсАТ,', 'билир.', 'ЩФ', 'ГГТП', 'мочевина', 'креатинин', 'амилаза мочи', 'амилаза крови', 'кальций', 'ЛДГ', 'СРБ', 'рН', 'рСО2', 'рО2', 'НСО3', 'tCO2', 'ABE', 'SO2', 'АЧТВ', 'ПИ', 'МНО', 'PROMISE',]

var generalInformation = `<div class="input-group mb-3 p-0">
<div class="input-group-append col-4 p-0">
  <button class="btn btn-outline-secondary dropdown-toggle col rounded" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">Показатель</button>
  <div class="dropdown-menu col p-0 rounded" id="myDropdown">
  <input type="text" id="searchInput" class="form-control p-2 searchInput rounded" onkeyup="filterFunction(this)" aria-label="Text input with dropdown button" placeholder="Search..">
  ${generalInformationArray.map(v=>'<a class="dropdown-item" onclick="btnName(this)">'+v+'</a>').join('')}
  
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
${periodInformationArray.map(v=>'<a class="dropdown-item" onclick="btnName(this)">'+v+'</a>').join('')}
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
function listFilterFunction(data) {
  var input, filter, a, i;
  input = data;
  filter = input.value.toUpperCase();
  div = data.parentElement;
  a = div.getElementsByTagName("li");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].hidden = false;
    } else {
      a[i].hidden = true;
    }
    if(filter=='') a[i].hidden = true
  }
}

function animate(options) {
  var start = performance.now();
  requestAnimationFrame(function animate(time) {
      var timeFraction = (time - start) / options.duration;
      if (timeFraction > 1) timeFraction = 1;
      var progress = options.timing(timeFraction)
      options.draw(progress);
      if (timeFraction < 1) {
          requestAnimationFrame(animate);
      }
  });
}
/**
 * 
 * @param {string} data - данные
 * @param {string} filename - имя файла
 * @param {HTMLElement} link - экземпляр кнопки 
 */
function downloadFile(data, filename, link){
    var file;
    var properties = {type: 'text/plain'}; // Specify the file's mime-type.
    try {
        file = new File(data, filename, properties);
    } catch (e) {
        file = new Blob([data], properties);
    }
    var url = URL.createObjectURL(file);
    link.href = url;
}
function loadIndicator(){
  var spinn = document.body.appendChild(document.createElement('div'))
  spinn.classList.add('load-indicator-block')
  spinn = spinn.appendChild(document.createElement('div'))
  spinn.classList.add('lds-dual-ring')
}
var surnames = ['Смирнов', 'Иванов', 'Кузнецов', 'Соколов', 'Попов', 'Лебедев','Козлов', 'Новиков', 'Морозов', 'Петров', 'Волков', 'Соловьёв','Васильев', 'Зайцев', 'Павлов', 'Семёнов', 'Голубев', 'Виноградов','Богданов', 'Воробьёв', 'Фёдоров', 'Михайлов', 'Беляев', 'Тарасов', 'Белов']
var man = ['Алан', 'Александр', 'Алексей', 'Альберт', 'Анатолий', 'Андрей', 'Антон', 'Арсен', 'Арсений', 'Артем', 'Артемий', 'Артур', 'Богдан', 'Борис', 'Вадим', 'Валентин', 'Валерий', 'Василий', 'Виктор', 'Виталий', 'Владимир', 'Владислав', 'Всеволод', 'Вячеслав', 'Геннадий', 'Георгий', 'Герман', 'Глеб', 'Гордей', 'Григорий', 'Давид', 'Дамир', 'Даниил', 'Демид', 'Демьян', 'Денис', 'Дмитрий', 'Евгений', 'Егор', 'Елисей', 'Захар', 'Иван', 'Игнат', 'Игорь', 'Илья', 'Ильяс', 'Камиль', 'Карим', 'Кирилл', 'Клим', 'Константин', 'Лев', 'Леонид', 'Макар', 'Максим', 'Марат', 'Марк', 'Марсель', 'Матвей', 'Мирон', 'Мирослав', 'Михаил', 'Назар', 'Никита', 'Николай', 'Олег', 'Павел', 'Петр', 'Платон', 'Прохор', 'Рамиль', 'Ратмир', 'Ринат', 'Роберт', 'Родион', 'Роман', 'Ростислав', 'Руслан', 'Рустам', 'Савва', 'Савелий', 'Святослав', 'Семен', 'Сергей', 'Станислав', 'Степан', 'Тамерлан', 'Тимофей', 'Тимур', 'Тихон', 'Федор', 'Филипп', 'Шамиль', 'Эдуард', 'Эльдар', 'Эмиль', 'Эрик', 'Юрий', 'Ян', 'Ярослав']
var woman = ['Агата', 'Агния', 'Аделина', 'Аида', 'Аксинья', 'Александра', 'Алена', 'Алина', 'Алиса', 'Алия', 'Алла', 'Альбина', 'Амелия', 'Амина', 'Анастасия', 'Ангелина', 'Анна', 'Антонина', 'Ариана', 'Арина', 'Валентина', 'Валерия', 'Варвара', 'Василина', 'Василиса', 'Вера', 'Вероника', 'Виктория', 'Виолетта', 'Владислава', 'Галина', 'Дарина', 'Дарья', 'Диана', 'Дина', 'Ева', 'Евангелина', 'Евгения', 'Екатерина', 'Елена', 'Елизавета', 'Есения', 'Жанна', 'Зарина', 'Злата', 'Илона', 'Инна', 'Ирина', 'Камилла', 'Карина', 'Каролина', 'Кира', 'Клавдия', 'Кристина', 'Ксения', 'Лариса', 'Лейла', 'Лиана', 'Лидия', 'Лилия', 'Лина', 'Лия', 'Любовь', 'Людмила', 'Майя', 'Маргарита', 'Марианна', 'Марина', 'Мария', 'Мелания', 'Мила', 'Милана', 'Милена', 'Мирослава', 'Надежда', 'Наталья', 'Нелли', 'Ника', 'Нина', 'Оксана', 'Олеся', 'Ольга', 'Полина', 'Регина', 'Сабина', 'Светлана', 'София', 'Стефания', 'Таисия', 'Тамара', 'Татьяна', 'Ульяна', 'Эвелина', 'Элина', 'Эльвира', 'Эльмира', 'Эмилия', 'Юлия', 'Яна', 'Ярослава']
var wl = ['Александровна', 'Алексеевна', 'Анатольевна', 'Андреевна', 'Антоновна', 'Аркадьевна', 'Артемовна', 'Богдановна', 'Борисовна', 'Валентиновна', 'Валерьевна', 'Васильевна', 'Викторовна', 'Виталиевна', 'Владимировна', 'Владиславовна', 'Вячеславовна', 'Геннадиевна', 'Георгиевна', 'Григорьевна', 'Даниловна', 'Денисовна', 'Дмитриевна', 'Евгеньевна', 'Егоровна', 'Ефимовна', 'Ивановна', 'Игоревна', 'Ильинична', 'Иосифовна', 'Кирилловна', 'Константиновна', 'Леонидовна', 'Львовна', 'Максимовна', 'Матвеевна', 'Михайловна', 'Николаевна', 'Олеговна', 'Павловна', 'Петровна', 'Платоновна', 'Робертовна', 'Романовна', 'Семеновна', 'Сергеевна', 'Станиславовна', 'Степановна', 'Тарасовна', 'Тимофеевна', 'Федоровна', 'Феликсовна', 'Филипповна', 'Эдуардовна', 'Юрьевна', 'Яковлевна', 'Ярославовна']
var ln = ['Александрович', 'Алексеевич', 'Анатольевич', 'Андреевич', 'Антонович', 'Аркадьевич', 'Артемович', 'Бедросович', 'Богданович', 'Борисович', 'Валентинович', 'Валерьевич', 'Васильевич', 'Викторович', 'Витальевич', 'Владимирович', 'Владиславович', 'Вольфович', 'Вячеславович', 'Геннадиевич', 'Георгиевич', 'Григорьевич', 'Данилович', 'Денисович', 'Дмитриевич', 'Евгеньевич', 'Егорович', 'Ефимович', 'Иванович', 'Иваныч', 'Игнатьевич', 'Игоревич', 'Ильич', 'Иосифович', 'Исаакович', 'Кириллович', 'Константинович', 'Леонидович', 'Львович', 'Максимович', 'Матвеевич', 'Михайлович', 'Николаевич', 'Олегович', 'Павлович', 'Палыч', 'Петрович', 'Платонович', 'Робертович', 'Романович', 'Саныч', 'Северинович', 'Семенович', 'Сергеевич', 'Станиславович', 'Степанович', 'Тарасович', 'Тимофеевич', 'Федорович', 'Феликсович', 'Филиппович', 'Эдуардович', 'Юрьевич', 'Яковлевич', 'Ярославович']
// var periods = ['Общий','24часа', '24-48часов', '3сутки','4-7сутки','12-15сутки','16-30сутки','Выписка'] 
/**
 * 
 * @param {String} cond - условие
 * 
 * функция определяет истинно ли условие
 *  если условие истинное - она вернет true
 *  если условие ложно - она вернет false
 */
var isTrue = (cond)=>{
    var ands = cond.match(/and(?=\[)|or(?=\[)/g) || [cond]
    var condArray = cond.split(/and(?=\[)|or(?=\[)/g)
    var bools = [];

    while(condArray.length>0){
        var compare = (statement, ...operand)=>{
            if(isNaN(operand[0])) operand[0] = '"' + operand[0].replace(/\s+/g, '') + '"'
            if(isNaN(operand[1])) operand[1] = '"' + operand[1].replace(/\s+/g, '') + '"'
            cond = operand[0] + statement + operand[1]
            return eval(cond)
        }
        if(condArray[0] == '') {
            condArray.pop();
            continue
        }
        o = condArray.pop().match(/==|>=|<=|>|<|!=/);
        ad = o.input.substr(0,o.index)
        dnum = ad.split('][')[1].substr(0,ad.split('][')[1].indexOf(']'))
        period = ad.split('][')[0].substr(1);//название периода
        period = ['Общий','24часа', '24-48часов', '3сутки','4-7сутки','12-15сутки','16-30сутки','Выписка'].indexOf(period);
        param = o[0].length>=2?o.input.substr(o.index+2).replace(/"/g,''):o.input.substr(o.index+1).replace(/"/g,'');
        if(ad.split('][').length > 2) {
            typeOfDiagnostic = this.typeofd
            if(typeOfDiagnostic == undefined) continue
            typeOfDiagnostic = typeOfDiagnostic['p'+period].filter(v=>v.name == ad.split('][')[1])[0]
            if(typeOfDiagnostic == undefined) continue
            res = getCondition(typeOfDiagnostic[ad.split('][')[2].substr(0,ad.split('][')[2].indexOf(']'))]);
            if(['==','>','<','>=','<=','!='].indexOf(o[0])==-1)continue
            if(compare(o[0], res.replace(/\s+/g, ''), param)) bools.push(true)
            else bools.push(false)
            continue
        }
        if(period==0){
            dnum = generalInformationArray.map(v=>v.replace(/\s+/gi, '')).indexOf(dnum)
            if(pdata[dnum] == '' || pdata[dnum] == undefined) return false;
            if(compare(o[0], pdata[dnum], param)) bools.push(true)
            else bools.push(false)
            continue
        }else{
            dnum = periodInformationArray.map(v=>v.replace(/\s+/gi, '')).indexOf(dnum)
            if(pdata['p'+(period)][dnum] == '' || pdata['p'+(period)][dnum] == undefined) return false;
            if(compare(o[0], pdata['p'+period][dnum], param)) bools.push(true)
            else bools.push(false)
            continue
        }
    }
    while(bools.length>=1){
        if(bools.length==1){
            return bools[0];
        }
        for(var and of ands){
            var index = ands.indexOf(and)
            and = ands.splice(index, 1)[0]
            if(and=='and'){
                if(bools[index] && bools[index+1]) bools.splice(index+1, 1)
                else bools.splice(index, 2, false)
            }else if(ands.indexOf('and') == -1 && and=='or'){
                if(bools[index] || bools[index+1]) bools.splice(index+1, 1)
                else bools.splice(index, 2, false)
            }
        }
    }
}

// while(condArray.length>0){
//     if(condArray[0] == '') {
//         condArray.pop();
//         continue
//     }
//     o = condArray.pop().match(/==|>=|<=|>|<|!=/);
//     ad = o.input.substr(0,o.index)
//     dnum = ad.split('][')[1].substr(0,ad.split('][')[1].indexOf(']'))
//     period = ad.split('][')[0].substr(1);//название периода
//     period = ['Общий','24часа', '24-48часов', '3сутки','4-7сутки','12-15сутки','16-30сутки','Выписка'].indexOf(period);
//     param = o.input.substr(o.index+2).replace(/"/g,'');
//     if(period==0){
//         if(ad.split('][').length > 2) {
//             typeOfDiagnostic = this.typeofd
//             if(typeOfDiagnostic == undefined) continue
//             typeOfDiagnostic = typeOfDiagnostic['p'+period].filter(v=>v.name == ad.split('][')[1])[0]
//             if(typeOfDiagnostic == undefined) continue
//             res = getCondition(typeOfDiagnostic[ad.split('][')[2].substr(0,ad.split('][')[2].indexOf(']'))]);
//             var compare = (statement, ...operand)=>{
//                 if(isNaN(operand[0])) operand[0] = '"' + operand[0] + '"'
//                 if(isNaN(operand[1])) operand[1] = '"' + operand[1] + '"'
//                 cond = operand[0] + statement + operand[1]
//                 return eval(cond)
//             }
//             if(['==','>','<','>=','<=','!='].indexOf(o[0])==-1)continue
//             if(compare(o[0], res.replace(/\s+/g, ''), param)) bools.push(true)
//             else bools.push(false)
//         }else{
//             dnum = generalInformationArray.map(v=>v.replace(/\s+/gi, '')).indexOf(dnum)
//             if(pdata[dnum] == '' || pdata[dnum] == undefined) return false;
//             if(o[0]=='=='){
//                 if(pdata[dnum].replace(/\s+/g, '') == param) bools.push(true)
//                 else bools.push(false)
//                 continue
//             }else if(o[0]=='>'){
//                 if(pdata[dnum].replace(/\s+/g, '') >  param) bools.push(true)
//                 else bools.push(false)
//                 continue
//             }else if(o[0]=='<'){
//                 if(pdata[dnum].replace(/\s+/g, '') < param) bools.push(true)
//                 else bools.push(false)
//                 continue
//             }else if(o[0]=='>='){
//                 if(pdata[dnum].replace(/\s+/g, '') >= param) bools.push(true)
//                 else bools.push(false)
//                 continue
//             }else if(o[0]=='<='){
//                 if(pdata[dnum].replace(/\s+/g, '') <= param) bools.push(true)
//                 else bools.push(false)
//                 continue
//             }else if(o[0]=='!='){
//                 if(pdata[dnum].replace(/\s+/g, '') != param) bools.push(true)
//                 else bools.push(false)
//                 continue                                
//             }
//         }
//     }else{
//         dnum = periodInformationArray.map(v=>v.replace(/\s+/gi, '')).indexOf(dnum)
//         if(pdata['p'+(period)][dnum] == '' || pdata['p'+(period)][dnum] == undefined) return false;
//         if(o[0]=='=='){
//             if(isNaN(pdata['p'+String(period)][dnum])){
//                 if(pdata['p'+String(period)][dnum].replace(/\s+/g, '') == param) bools.push(true)
//                 else bools.push(false)
//             }else{
//                 if(pdata['p'+String(period)][dnum] == param) bools.push(true)
//                 else bools.push(false)
//             }
//             continue
//         }else if(o[0]=='>'){
//             if(isNaN(pdata['p'+String(period)][dnum])){
//                 if(pdata['p'+String(period)][dnum].replace(/\s+/g, '') >  param) bools.push(true)
//                 else bools.push(false)
//             }else{
//                 if(pdata['p'+String(period)][dnum] >  param) bools.push(true)
//                 else bools.push(false)
//             }
//             continue
//         }else if(o[0]=='<'){
//             if(isNaN(pdata['p'+String(period)][dnum])){
//                 if(pdata['p'+String(period)][dnum].replace(/\s+/g, '') < param) bools.push(true)
//                 else bools.push(false)
//             }else{
//                 if(pdata['p'+String(period)][dnum] < param) bools.push(true)
//                 else bools.push(false)
//             }
//             continue
//         }else if(o[0]=='>='){
//             if(isNaN(pdata['p'+String(period)][dnum])){
//                 if(pdata['p'+String(period)][dnum].replace(/\s+/g, '') >= param) bools.push(true)
//                 else bools.push(false)
//             }else{
//                 if(pdata['p'+String(period)][dnum] >= param) bools.push(true)
//                 else bools.push(false)
//             }
//             continue
//         }else if(o[0]=='<='){
//             if(isNaN(pdata['p'+String(period)][dnum])){
//                 if(pdata['p'+String(period)][dnum].replace(/\s+/g, '') <= param) bools.push(true)
//                 else bools.push(false)
//             }else{
//                 if(pdata['p'+String(period)][dnum] <= param) bools.push(true)
//                 else bools.push(false)
//             }
//             continue
//         }else if(o[0]=='!='){
//             if(isNaN(pdata['p'+String(period)][dnum])){
//                 if(pdata['p'+String(period)][dnum].replace(/\s+/g, '') != param) bools.push(true)
//                 else bools.push(false)
//             }else{
//                 if(pdata['p'+String(period)][dnum] != param) bools.push(true)
//                 else bools.push(false)
//             }
//             continue                                
//         }
//     }
// }