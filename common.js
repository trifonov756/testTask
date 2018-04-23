$(document).ready(function () {

var countryTemplate=$(".country_template");
var countryWrapper=$("#wrapper_list");
var sideWrapper=$("#side_wrapper");
var favCountries = {};
/*
*   Отображение избранного после перезагрузки
*/
function localStorageDelete(){
    for (var i = 0; i < localStorage.length; ++i) {
        var lsKey = localStorage.key(i);
        if((lsKey.substr(0,3))=='fav'){
            sideWrapper.append("<li id='fav"+lsKey+"'><p>"+localStorage[lsKey]+
                               "</p><button type='button' class='del' id='del"+lsKey+"'>Удалить</button></li>");
            sideWrapper.find('#del'+lsKey).click(function (e) {
                e.preventDefault();
                localStorage.removeItem(lsKey);
                sideWrapper.find('#fav'+lsKey).remove();
                delete favCountries[item.alpha3Code];
                country_record.find('.fav_del').hide();
                country_record.find('.fav_add').show();
                location.reload();
            });
        }
    }
}
/**
 * Генерирует данные для шаблона вывода информации о странах
 *
 * @param {result} javascript object - объект с данными о странах 
 */
function generateCountry (result) {
    var tempArr=[];
    result.forEach(function (item) {
        var country_record = countryTemplate.clone(true);
        tempArr.push(item.nativeName);
    });
    result.forEach(function (item) {
        var country_record = countryTemplate.clone(true);
        country_record.attr("id",'item'+item.alpha3Code);
        country_record.find('.c_title').html(item.nativeName);
        country_record.find('.c_img').attr("src",item.flag);
        country_record.find('.c_code').html(item.alpha3Code);
        country_record.find('.c_lang').html(item.languages.map(function (item2) {
            return item2.name;
        }).join(' - '));
        country_record.find('.c_border').html(tempArr.join(', '));
        //Кнопка "В избранное""
        country_record.find('.fav_add').click(function (e) {
            e.preventDefault();
            $(this).hide();
            country_record.find('.fav_del').show();
            favCountries[item.alpha3Code]=item;
            var favAlpha3Code = favCountries[item.alpha3Code].alpha3Code;
            var favName = favCountries[item.alpha3Code].name;
            sideWrapper.append("<li id='fav"+favAlpha3Code+"'><p>"+
                                favName+"</p><button type='button' class='del' id='del"+
                                favAlpha3Code+"'>Удалить</button></li>");
            localStorage.setItem('fav'+favAlpha3Code,favName);
        //Кнопка "удалить" в сайдбаре
            sideWrapper.find('#del'+favAlpha3Code).click(function (e) {
                e.preventDefault();
                localStorage.removeItem('fav'+favAlpha3Code);
                sideWrapper.find('#fav'+favAlpha3Code).remove();
                delete favAlpha3Code;
                country_record.find('.fav_del').hide();
                country_record.find('.fav_add').show();
            });
        });
         //Кнопка "Удалить из избранного"
        country_record.find('.fav_del').click(function (e) {
            e.preventDefault();
            var favAlpha3Code = favCountries[item.alpha3Code].alpha3Code;
            $(this).hide();
            country_record.find('.fav_add').show();
            sideWrapper.find('#fav'+favAlpha3Code).remove();
            localStorage.removeItem('fav'+favAlpha3Code);
            delete favAlpha3Code;
        });
        countryWrapper.append(country_record);
    });
}
/**
 * Генерирует данные для шаблона вывода информации о странах
 *
 * @param {result} javascript object - объект с данными о странах 
 */
function showButtonHandler (result) {
    result.forEach(function (item) {
        var show=$("#item"+item.alpha3Code+" .show");
        show.click(function () {
             if($("#item"+item.alpha3Code+" .full_info").is(':visible')){
                show.html("Показать ↓");
            } else{
                show.html("Скрыть ↑");
            }  
           $("#item"+item.alpha3Code+" .full_info").slideToggle();
        });
    });
}
localStorageDelete();
$("#search_but").click(function (e) {
    e.preventDefault();
    var inputText=$("#search_field").val();
    $.ajax({
    url: 'https://restcountries.eu/rest/v2/name/'+inputText,
    type: "GET",
    success: function (result) {
        if(result.length==1){
            countryTemplate.removeClass('part');
            countryTemplate.addClass('full');
            generateCountry(result);
        } else {
            countryWrapper.append("<h1>Cписок стран</h1>");
            countryTemplate.removeClass('full');
            countryTemplate.addClass('part');
            generateCountry(result);
            showButtonHandler(result);
        }
    }
});
});

});




