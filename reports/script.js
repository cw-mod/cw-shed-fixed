$(document).ready(function(){
    //test
    //var testdt = new Date();
    //testdt.setTime( testdt.getTime() + (testdt.getTimezoneOffset() - 180)*60*1000);
    //test
    
    $("form").submit(function(e){e.preventDefault();});
    function getCookie(name) {
        let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
        return matches ? decodeURIComponent(matches[1]) : undefined;
    }
    function masking(maskStr, catID) {
        return maskStr.replace(/%ID/g, catID);
    }
    function addErr(text) {
        return "<span class=error-message><b>!</b> "+text+"</span>";
    }
    function splitDateStr(datestr) {
        if (datestr) {
            let dt = {};
            let arr = datestr.split('-');//yyyy-MM-dd
            dt.shortYear = arr[0].substring(2);
            dt.year = arr[0];
            dt.month = arr[1];
            dt.day = arr[2];
            return dt;
        } else {
            return false;
        }
        
    }
    function toMaskedArr(str, maskStr) {
        str = str.replace(/\n/g, " ");
        let tmp_arr = [];
        let mul_id_err = false;
        let id_arr = str.trim().split(" ");
        if (str.length) {
            $.each(id_arr, function(key, value) {
                if (parseInt(value)==value)
                    tmp_arr.push(masking(maskStr, value));
                else if (value !== "")
                        mul_id_err = true;
            });
        }
        let res = {};
        res.arr = tmp_arr;
        res.mul_id_err = mul_id_err;
        return res;
        
    }
    function addLeadZero(num) {return num < 10 ? '0' + num : num;}
    function display_txt(txt_id, text) {/*Кнопка "Составить отчёт"*/
        $("#"+txt_id+"_txt").html(text);
        $("#"+txt_id+"_txt").addClass('data-visible');
        if (!$("#"+txt_id+"_txt .error-message").length) {
            $("#"+txt_id+"_copy").attr('style', 'display:inline-block;');
        } else {
            $("#"+txt_id+"_copy").attr('style', 'display:none;');
        }
        $("#"+txt_id+"_copy_yes").attr('style', 'display:none;');
    }
    function wordEnd(num, endDef, end1, end2to4) {/*Число, окончание слова если %10=0,окончание слова если %10=1,окончание слова если %10=2*/
        let end = endDef;
        if (num < 10 || num > 20) {
            if (num % 10==1) end = end1;
            else if (num % 10 < 5 && num % 10 > 1) end = end2to4;
        }
        return end;
    }
    $(".add_list").click(function(e) {
        let id = "#"+$(this).attr("data-target");
        if ($(id).children().length<=$(id).attr("max-children")) {
            let tmp = $(id).find(".template").html();
            $(id).append(tmp);
        }
    });
    $(".del_list").click(function(e) {
        let id = "#"+$(this).attr("data-target");
        if ($(id).children().length>1) {
            $(id).children()[$(id).children().length-1].remove();
        }
    });
    
    if (getCookie('conv') !== undefined) {
        $('.solo-accord').addClass('open').find('.submenuItems').slideDown();
    }
    if (getCookie('gen') == "1") {
        $('.gend-enable[value=1]').prop("checked", true);
    }
    else {
        $('.gend-enable[value=0]').prop("checked", true);
    }
    
    $('.dropdownlink[tribe='+getCookie('tribe')+']').next().slideDown().parent().addClass('open').attr("style", "order: -1;");

    $('.dropdownlink').click(function(){
        if ($(this).attr('tribe') !== undefined) {
            let maxage = 60*60*24*365;
            document.cookie = "tribe="+$(this).attr('tribe')+"; max-age="+maxage;
        }
    });
    $(".copy_btn").click(function() {
        let $tmp = $("<textarea>");
        $("body").append($tmp);
        let id = $(this).attr('id').split("_copy")[0];
        $tmp.val($("#"+id+"_txt").html().replace(/<br>/g, "\n")).select();
        document.execCommand("copy");
        $tmp.remove();
        $("#"+id+"_copy_yes").attr('style', 'display:inline-block;');
    });
    $("#create_doz").click(function() {
        let txt = "";
        let date = new Date($("#doz_date").val());
        let month   = addLeadZero(date.getMonth()+1);
        let day     = addLeadZero(date.getDate());
        if (isNaN(date))
            txt += addErr("Ошибка: не выставлена дата.");
        else 
            txt += "[b]Дата:[/b] "+day+"."+month+";<br>";
        let time = parseInt($("#doz_time").val().split(":")[0]);
        if (isNaN(time)) {txt += addErr("Ошибка: не выставлено время.");}
        else {
            let time_end = (time==23) ? 0 : time+1;
            time_end = addLeadZero(time_end);
            time = addLeadZero(time);
            txt += `[b]Время:[/b] ${time}:00-${time_end}:00;<br>`;
        }
        let par_list = toMaskedArr($("#doz_id").val().trim(), "[cat%ID] [%ID]");
        txt += (par_list.arr.length) ? `[b]Участники:[/b] ${par_list.arr.join(", ")}<br>` : addErr("Ошибка: нет ID участников.");
        txt += `[b]Вид дозора:[/b] ${$("#doz_type").val()}.`;
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    $("#create_patr").click(function() {
        let a = parseInt($("input[name='patr_type']:checked").val());
        let txt = "";
        let lead_id = parseInt($("#patr_lead_id").val().trim());
        let par_list;
        let m;
        switch (a) {
            case 0:
                let date = new Date($("#pogr_date").val());
                if (isNaN(date)) {
                    txt += addErr("Ошибка: не выставлена дата.");
                } else {
                    let month   = addLeadZero(date.getMonth()+1);
                    let day     = addLeadZero(date.getDate());
                    let time = parseInt($("#pogr_time").val().split(":")[0]);
                    if (isNaN(time)) {txt += addErr("Ошибка: не выставлено время.");}
                    else {txt += `[b]Дата и время:[/b] ${day}.${month}, ${time}:00;<br>`;}
                }
                m = $("input[name='marsh_num']:checked").val();
                txt += (m === undefined) ? addErr("Ошибка: не выбран номер маршрута.") : `[b]Маршрут:[/b] ${m};<br>`;
                txt += (isNaN(lead_id)) ? addErr("Ошибка: некорректный ID ведущего.") : "[b]Ведущий:[/b] "+masking("[cat%ID] [%ID]", lead_id)+";<br>";
                par_list = toMaskedArr($("#patr_id").val().trim(), "[cat%ID] [%ID]");
                txt += (par_list.arr.length) ? `[b]Участники:[/b] ${par_list.arr.join(", ")};<br>` : addErr("Ошибка: нет ID участников.");
                if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID; некорректные ID убраны из отчёта.");}
                break;
            case 1://herb
                m = $("input[name='herb_type']:checked").val();
                txt += (m === undefined) ? addErr("Ошибка: не выбран тип травника.") : `[b]Тип травника:[/b] ${m};<br>`;
                txt += (isNaN(lead_id)) ? addErr("Ошибка: некорректный ID ведущего.") : "[b]Ведущий:[/b] "+masking("[cat%ID] [%ID]", lead_id)+";<br>";
                par_list = toMaskedArr($("#patr_id").val().trim(), "[cat%ID] [%ID]");
                txt += (par_list.arr.length) ? `[b]Участники:[/b] ${par_list.arr.join(", ")};<br>` : addErr("Ошибка: нет ID участников.");
                if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID; некорректные ID убраны из отчёта.");}
                txt += `[b]Особые происшествия:[/b] ${$("#herb_situ").val()};<br>`;
                /*let herb = [];
                if ($("#herb_amt").val() != 0) {herb.push(parseInt($("#herb_amt").val())+" трав");}
                if ($("#wmoss_amt").val() != 0) {herb.push(parseInt($("#wmoss_amt").val())+" водяного мха");}
                if ($("#moss_amt").val() != 0) {herb.push(parseInt($("#moss_amt").val())+" обычного мха");}
                txt += (herb.length) ? `[b]Общее количество принесённых трав:[/b] ${herb.join(", ")}.<br>` : addErr("Ошибка: не указано количество трав.");*/
                break;
            case 2://hunt
                txt += "[b]Вид:[/b] ";
                txt += ($("input[name='hunt_type']:checked").val()=="0") ? "утренняя" : "вечерняя";
                txt += ";<br>";
                txt += (isNaN(lead_id)) ? addErr("Ошибка: некорректный ID ведущего.") : "[b]Ведущий:[/b] "+masking("[cat%ID] (%ID) [5]", lead_id)+";<br>";
                if ($("#patr_id").val().length) {
                    par_list = toMaskedArr($("#patr_id").val().trim(), "[cat%ID] (%ID) [5]");
                    if (par_list.arr.length) {txt += `[b]Участники:[/b] ${par_list.arr.join(", ")};<br>`;}
                    if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID; некорректные ID убраны из отчёта.");}
                } else {txt += "[b]Участники:[/b] -.<br>";}
                if ($("#patr_extra_id").val().length) {
                    par_list = toMaskedArr($("#patr_extra_id").val().trim(), "[cat%ID] (%ID)");
                    if (par_list.arr.length) {txt += `[b]Таскающие:[/b] ${par_list.arr.join(", ")};<br>`;}
                    if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID; некорректные ID убраны из отчёта.");}
                } else {txt += "[b]Таскающие:[/b] -.";}
                break;
        }
        display_txt($(this).attr("id"), txt);
    });
    $('#create_doz_gath_0').click(function() {
        
    });
    $("#create_patr_10").click(function() {
        let txt = "";
        let date = new Date($("#pogr_date_10").val());
        if (isNaN(date)) {
            txt += addErr("Ошибка: не выставлена дата.");
        } else {
            let month   = addLeadZero(date.getMonth()+1);
            let day     = addLeadZero(date.getDate());
            let time = parseInt($("#pogr_time_10").val().split(":")[0]);
            if (isNaN(time)) {txt += addErr("Ошибка: не выставлено время.");}
            else {
                time = addLeadZero(time);
                txt += `[b]1. Дата и время проведения патруля:[/b] ${time}:00; ${day}.${month}.${date.getFullYear()}<br>`;
            }
        }
        
        let lead_id = parseInt($("#patr_lead_id_10").val().trim());
        txt += (isNaN(lead_id)) ? addErr("Ошибка: некорректный ID ведущего.") : "[b]2. Ведущий:[/b] "+masking("[cat%ID] / %ID", lead_id)+";<br>";
        
        let par_list = toMaskedArr($("#patr_id_10").val().trim(), "[cat%ID] / %ID");
        txt += (par_list.arr.length) ? `[b]3. Ходили:[/b] ${par_list.arr.join(", ")}<br>` : addErr("Ошибка: нет ID участников.");
        txt += "[b]4. Имелись ли нарушители:[/b] ";
        txt += ($("#patr_extra_10").val().length) ? $("#patr_extra_10").val() : "-";
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    $("#create_doz_10").click(function() {
        let txt = "";
        let m = $("input[name='doz_type_10']:checked").val();
        if (m !== undefined) {
            txt += `Вид: ${m} дозор`;
            if ($("#doz_extra_10").prop("checked") == true && m == "сидячий") txt += " [Небесная тропа]";
            txt += "<br>";
        }
        else {
            txt += addErr("Ошибка: не выбран тип дозора.");
        }
        let date = new Date($("#doz_date_10").val());
        if (isNaN(date)) {
            txt += addErr("Ошибка: не выставлена дата.");
        } else {
            let month = addLeadZero(date.getMonth()+1);
            let day = addLeadZero(date.getDate());
            let time = parseInt($("#doz_time_10").val().split(":")[0]);
            if (isNaN(time)) {txt += addErr("Ошибка: не выставлено время.");}
            else {
                let nextHr = time;
                let end = ":30";
                if ($("#doz_id_10").val().length) {
                    nextHr = (time==23) ? 0 : time+1; end = ":00";
                }
                nextHr = addLeadZero(nextHr)+end;
                time = addLeadZero(time);
                txt += `Дата и время: ${time}:00 - ${nextHr}; ${day}.${month}.${date.getFullYear()}<br>`;
            }
        }
        
        let par_list = toMaskedArr($("#doz_id_10").val().trim(), "[cat%ID] / %ID");
        let par_list2 = toMaskedArr($("#doz_half_id_10").val().trim(), "[cat%ID] / %ID (0.5)");
        let id_arr = $.merge(par_list.arr, par_list2.arr);
        txt += (id_arr.length) ? `Кто ходил: ${id_arr.join(", ")}` : addErr("Ошибка: нет ID участников.");
        if (par_list.mul_id_err || par_list2.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    $("#create_patr_20").click(function() {
        let txt = "";
        let date = new Date($("#pogr_date_20").val());
        if (isNaN(date)) {
            txt += addErr("Ошибка: не выставлена дата.");
        } else {
            let month = date.getMonth() < 10 ? '0' + (date.getMonth()+1) : (date.getMonth()+1);
            let day = date.getDate()  < 10 ? '0' + date.getDate()  : date.getDate();
            txt += `1. ${day}.${month}.${date.getFullYear()}. ${$("#pogr_time_b_20").val()} - ${$("#pogr_time_e_20").val()};<br>`;
        }
        let m = $("input[name='patr_type_20']:checked").val();
        txt += (m !== undefined) ? `2. Вид: ${m} дозор.<br>` : addErr("Ошибка: не выбран тип патруля.");
        let lead_id = parseInt($("#patr_lead_id_20").val().trim());
        txt += (isNaN(lead_id)) ? addErr("Ошибка: некорректный ID ведущего.") : "3. Ведущий: "+masking("[cat%ID] [%ID]", lead_id)+".<br>";
        let par_list = toMaskedArr($("#patr_id_20").val().trim(), "[cat%ID] [%ID]");
        txt += (par_list.arr.length) ? `4. Участники: ${par_list.arr.join(", ")}.<br>` : addErr("Ошибка: нет ID участников.");
        if ($("#patr_extra_20").val().trim().length) {
            let mul_id_err = false;
            let tmp_arr = [];
            let id_arr = $("#patr_extra_20").val().trim().split(",");
            $.each(id_arr, function(key, value) {
                let tmp = value.trim();
                let id = tmp.substr(0, tmp.indexOf(' '));
                let nar = tmp.substring(id.length);
                if (!isNaN(id)) tmp_arr.push(masking("[cat%ID] [%ID]", id)+" "+nar);
                else if (value !== "") mul_id_err = true;
            });
            txt += `5. Нарушители: ${tmp_arr.join(", ")}.`;
            if (mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID нарушителей; некорректные ID убраны из отчёта.");}
        }
        else {
            txt += "5. Нарушители: — .";
        }
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    
    $("#create_patr_21").click(function() {
        let txt = "";
        let g = ($("input[name='gend_1_21']:checked").val() == 1) ? "а" : "";
        let gath_id = parseInt($("#patr_gath_id_21").val().trim());
        txt += (isNaN(gath_id)) ? addErr("Ошибка: некорректный ID собирающего.") : "[b]Собирал"+g+":[/b] "+masking("[l[n]i[/n]nk%ID]", gath_id)+"<br>";
        let par_list = toMaskedArr($("#patr_lead_id_21").val().trim(), "[l[n]i[/n]nk%ID]");
        txt += (par_list.arr.length) ? `[b]Ведущие:[/b] ${par_list.arr.join(", ")}<br>` : addErr("Ошибка: нет ID ведущих.");
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID ведущих; некорректные ID убраны из отчёта.");}
        par_list = toMaskedArr($("#patr_id_21").val().trim(), "[l[n]i[/n]nk%ID]");
        txt += (par_list.arr.length) ? `[b]Участники:[/b] ${par_list.arr.join(", ")}<br>` : addErr("Ошибка: нет ID участников.");
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        if ($("#patr_extra_id_21").val().length) {
            par_list = toMaskedArr($("#patr_extra_id_21").val().trim(), "[l[n]i[/n]nk%ID]");
            if (par_list.arr.length) {txt += `[b]Нарушители:[/b] ${par_list.arr.join(", ")}<br>`;}
            if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID нарушителей; некорректные ID убраны из отчёта.");}
        } else {txt += "[b]Нарушители:[/b] —<br>";}
        let herb = parseInt($("#herb_amt_21").val());
        console.log($("#herb_amt_21").val());
        txt += (!isNaN(herb) && herb > 0) ? `[b]Количество трав:[/b] ${herb}<br>` : addErr("Ошибка: не указано количество трав / неверное количество трав.");
        display_txt($(this).attr("id"), txt);
    });
    $("#create_doz_21").click(function() {
        let txt = "";
        let date = new Date($("#doz_date_21").val());
        if (isNaN(date)) {
            txt += addErr("Ошибка: не выставлена дата.");
        } else {
            let month = addLeadZero(date.getMonth()+1);
            let day = addLeadZero(date.getDate());
            let timeb = $("#doz_time_b_21").val().split(":");
            if (isNaN(timeb[0]) || isNaN(timeb[1])) {txt += addErr("Ошибка: не выставлено время начала.");}
            else {
                let timee = $("#doz_time_e_21").val().split(":");
                if (isNaN(timee[0]) || isNaN(timee[1])) {txt += addErr("Ошибка: не выставлено время окончания.");} else {
                    timeb = new Date($("#doz_date_21").val()+" "+$("#doz_time_b_21").val());
                    timee = new Date($("#doz_date_21").val()+" "+$("#doz_time_e_21").val());
                    let dif_h = (timee.getTime() - timeb.getTime()) / 60000;
                    if (dif_h < 0) dif_h += 1440;
                    console.log(dif_h);
                    let dif_m = dif_h % 60;
                    dif_h -= dif_m;
                    dif_h /= 60;
                    console.log(dif_h+" "+dif_m);
                    let timestr = [];
                    if (dif_h !== 0) {
                        let tmp_s = "ов";
                        if (dif_h % 10 == 1) tmp_s = "";
                        if (dif_h % 10 > 1 && dif_h % 10 < 5) tmp_s = "а";
                        if (dif_h > 9 && dif_h < 20) tmp_s = "ов";
                        timestr.push(dif_h + " час"+tmp_s);
                    }
                    if (dif_m !== 0) {
                        let tmp_s = "";
                        if (dif_m % 10 == 1) tmp_s = "а";
                        if (dif_m % 10 > 1 && dif_m % 10 < 5) tmp_s = "ы";
                        if (dif_m > 9 && dif_m < 20) tmp_s = "";
                        timestr.push(dif_m + " минут"+tmp_s);
                    }
                    
                    txt += `${day}/${month} ${$("#doz_time_b_21").val()}-${$("#doz_time_e_21").val()} (${timestr.join(" ")})<br>`;
                }
            }
        }
        let g = ($("input[name='gend_2_21']:checked").val() == 1) ? "а" : "";
        let id = parseInt($("#doz_id_21").val().trim());
        txt += (isNaN(id)) ? addErr("Ошибка: некорректный ID участника.") : "[b]Участвовал"+g+":[/b] "+masking("[link%ID]", id)+"<br>";
        let m = $("input[name='marsh_num_21']:checked").val();
        txt += (m !== undefined) ? `[b]Маршрут:[/b] ${m}<br>` : addErr("Ошибка: не выбран тип патруля.");
        if ($("#doz_extra_id_21").val().length) {
            let par_list = toMaskedArr($("#doz_extra_id_21").val().trim(), "[link%ID]");
            if (par_list.arr.length) {txt += `[b]Нарушители:[/b] ${par_list.arr.join(", ")}`;}
            if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID нарушителей; некорректные ID убраны из отчёта.");}
        } else {txt += "[b]Нарушители:[/b] —";}
        display_txt($(this).attr("id"), txt);
    });
    $("#create_solo_hunt_21").click(function() {
        let txt = "";
        let date = new Date($("#solo_hunt_date_21").val());
        if (isNaN(date)) {
            txt += addErr("Ошибка: не выставлена дата.");
        } else {
            let month = addLeadZero(date.getMonth()+1);
            let day = addLeadZero(date.getDate());
            txt += `${day}/${month}<br>`;
        }
        let id = parseInt($("#patr_gath_id_21").val().trim());
        txt += (isNaN(id)) ? addErr("Ошибка: некорректный ID охотника.") : "[b]Охотник:[/b] "+masking("[link%ID]", id)+"<br>";
        let norm = $("#hunt_norm_21").val() || 0;
        let best = $("#hunt_best_21").val() || 0;
        txt += "[b]Количество дичи:[/b] ("+norm+"/"+best+")";
        display_txt($(this).attr("id"), txt);
    });
    $("#create_mass_hunt_21").click(function() {
        let txt = "";
        let g = ($("input[name='gend_3_21']:checked").val() == 1) ? "а" : "";
        let gath_id = parseInt($("#hunt_gath_id_21").val().trim());
        txt += (isNaN(gath_id)) ? addErr("Ошибка: некорректный ID собирающего.") : "[b]Собирал"+g+":[/b] "+masking("[link%ID]", gath_id)+"<br>";
        
        let par_list = toMaskedArr($("#hunt_lead_id_21").val().trim(), "[link%ID]");
        txt += (par_list.arr.length) ? `[b]Ведущие:[/b] ${par_list.arr.join(", ")}<br>` : addErr("Ошибка: нет ID ведущих.");
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID ведущих; некорректные ID убраны из отчёта.");}
        let hunters = [];
        let hunters_err = false;
        $("#hunt_list_21 > .hunt_list_21_el").each(function(index) {
            let id = $(this).find(".text-short").val().trim();
            let intid = parseInt(id);
            if ((isNaN(intid) || intid != id) && (id !== "")) {hunters_err = true;}
            else if (id !== "") {
                let smol = parseInt($(this).find(".smol").val()) || 0;
                let medi = parseInt($(this).find(".medi").val()) || 0;
                let succ = parseInt($(this).find(".succ").val()) || 0;
                hunters.push(masking("[link%ID]", id)+" ("+smol+"/"+medi+"/"+succ+")");
            }
        });
        txt += (hunters.length) ? `[b]Участники:[/b] ${hunters.join(", ")}<br>` : addErr("Ошибка: нет ID участников.");
        if (hunters_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        if ($("#hunt_extra_id_21").val().length) {
            par_list = toMaskedArr($("#hunt_extra_id_21").val().trim(), "[link%ID]");
            if (par_list.arr.length) {txt += `[b]Носильщики:[/b] ${par_list.arr.join(", ")}<br>`;}
            if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID носильщиков; некорректные ID убраны из отчёта.");}
        } else {txt += "[b]Носильщики:[/b] —<br>";}
        display_txt($(this).attr("id"), txt);
    });
    $("#create_games_21").click(function() {
        let txt = "";
        let date = new Date($("#game_date_21").val());
        if (isNaN(date)) {
            txt += addErr("Ошибка: не выставлена дата.");
        } else {
            let month = addLeadZero(date.getMonth()+1);
            let day = addLeadZero(date.getDate());
            let time = $("#game_time_21").val();
            if (time == "") {
                txt += addErr("Ошибка: не выставлено время.");
            } else {
                txt += `${day}/${month} (${time})<br>`;//25/03 (12:00)
            }
        }
        let g = ($("input[name='gend_4_21']:checked").val() == 1) ? "а" : "";
        let gath_id = parseInt($("#games_gath_id_21").val().trim());
        txt += (isNaN(gath_id)) ? addErr("Ошибка: некорректный ID собирающего.") : "[b]Собирал"+g+":[/b] "+masking("[link%ID]", gath_id)+"<br>";
        let par_list = toMaskedArr($("#games_id_21").val().trim(), "[link%ID]");
        txt += (par_list.arr.length) ? `[b]Участники:[/b] ${par_list.arr.join(", ")}<br>` : addErr("Ошибка: нет ID участников.");
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        txt += ($("#games_data_21").val()) ? "[b]Проведённые игры:[/b] "+$("#games_data_21").val() : addErr("Ошибка: не указаны проведённые игры.");
        display_txt($(this).attr("id"), txt);
    });

    $("#create_train_21").click(function() {
        let txt = "";
        let g = ($("input[name='gend_5_21']:checked").val() == 1) ? "а" : "";
        let gath_id = parseInt($("#train_gath_id_21").val().trim());
        txt += (isNaN(gath_id)) ? addErr("Ошибка: некорректный ID собирающего.") : "[b]Собирал"+g+":[/b] "+masking("[link%ID]", gath_id)+"<br>";
        let par_list = toMaskedArr($("#train_id_21").val().trim(), "[link%ID]");
        txt += (par_list.arr.length) ? `[b]Участники:[/b] ${par_list.arr.join(", ")}<br>` : addErr("Ошибка: нет ID участников.");
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    $("#create_patr_3").click(function() {/*Тени, погран*/
        let txt = "";
        let tip = $("input[name='patr_type_3']:checked").val();
        txt += (tip !== undefined) ? `${tip} патруль` : addErr("Ошибка: не выбран вид патруля.");
        let date = splitDateStr($("#pogr_date_3").val());
        if(date) {
            txt += ` [${date.day}.${date.month}.${date.shortYear}]<br>`;
        } else {
            txt += addErr("Ошибка: не выставлена дата.");
        }
        let m = $("input[name='marsh_num_3']:checked").val();
        txt += (m !== undefined) ? `Маршрут: ${m} часть<br>` : addErr("Ошибка: не выбран маршрут патруля.");
        let g = ($("input[name='gend_0_3']:checked").val() == 1) ? "Вела" : "Вёл";
        let lead_id = parseInt($("#patr_lead_id_3").val().trim());
        let points = (tip != "Вечерний")?" [+2]":"";
        txt += (isNaN(lead_id)) ? addErr("Ошибка: некорректный ID ведущего.") : g+": "+masking("[cat%ID] [%ID]", lead_id)+points+"<br>";
        let par_list = toMaskedArr($("#patr_id_3").val().trim(), "[cat%ID] [%ID]");
        txt += (par_list.arr.length) ? `Участники: ${par_list.arr.join(", ")}<br>` : "Участники: -<br>";
        if (tip == "Утренний") {
            let val = $("#branch_amt_3").val(), branch = '-';
            if (val!=0) {branch = val + " крепк" + wordEnd(val, "их", "ая", "их") + " вет" + wordEnd(val, "ок", "ка", "ки");}
            txt += "Собрано: "+branch;
        } 
        else if (tip == "Дневной") {
            let tmpgath = [],
            val = $("#herb_amt_3").val();
            if (val!=0) {tmpgath.push(val+" трав"+wordEnd(val, "", "а", "ы"));}
            val = $("#bindweed_amt_3").val();
            if (val!=0) {tmpgath.push(val+" вьюн"+wordEnd(val, "ков", "ок", "ка"));}
            val = $("#web_amt_3").val();
            if (val!=0) {tmpgath.push(val+" паутин"+wordEnd(val, "ок", "ка", "ки"));}
            if (!$("#pogr_3_flower[style*='none']").length) tmpgath.push("цветок");
            txt += "Собрано: ";
            txt += (tmpgath.length) ? tmpgath.join(", ") : "-";
        }
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    
    $("#create_moss_3").click(function() {/*Тени, мох*/
        let txt = "Сбор мха",
            date = splitDateStr($("#moss_date_3").val());
        if (date) {
            txt += ` [${date.day}.${date.month}.${date.shortYear}]<br>`;
        } else {
            txt += addErr("Ошибка: не выставлена дата.");
        }
        let m = $("input[name='moss_num_3']:checked").val();
        txt += (m !== undefined) ? `Маршрут: ${m} часть<br>` : addErr("Ошибка: не выбран маршрут патруля.");
        let g = ($("input[name='gend_1_3']:checked").val() == 1) ? "Вела" : "Вёл",
            lead_id = parseInt($("#moss_lead_id_3").val().trim());
        txt += (isNaN(lead_id)) ? addErr("Ошибка: некорректный ID ведущего.") : g+": "+masking("[cat%ID] [%ID]", lead_id)+" [+2]<br>";
        let par_list = toMaskedArr($("#moss_id_3").val().trim(), "[cat%ID] [%ID]");
        txt += (par_list.arr.length) ? `Участники: ${par_list.arr.join(", ")}<br>` : "Участники: -<br>";
        let tmpgath = [],
            val = $("#moss_amt_3").val();
        if (val!=0) {tmpgath.push(val+" обычн"+wordEnd(val, "ых", "ый", "ого"));}
        val = $("#wmoss_amt_3").val();
        if (val!=0) {tmpgath.push(val+" водян"+wordEnd(val, "ых", "ой", "ого"));}
        txt += "Собрано: ";
        txt += (tmpgath.length) ? tmpgath.join(", ") : "-";
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    
    $("#create_hunt_3").click(function() {/*Тени, охота*/
        let txt = "";
        let totalPrey = parseInt($("#lead_prey_3").val()) || 0;
        let tip = $("input[name='hunt_type_3']:checked").val();
        txt += (tip !== undefined) ? `${tip} патруль:` : addErr("Ошибка: не выбран вид патруля.");
        let date = splitDateStr($("#hunt_date_3").val());
        if(date) {
            txt += ` ${date.day}.${date.month}.${date.shortYear}<br>`;
        } else {
            txt += addErr("Ошибка: не выставлена дата.");
        }
        let g = ($("input[name='gend_2_3']:checked").val() == 1) ? "ая" : "ий";
        let lead_id = parseInt($("#hunt_lead_id_3").val().trim());
        txt += (isNaN(lead_id)) ? addErr("Ошибка: некорректный ID руководящего.") : "Руководящ"+g+": "+masking("[cat%ID]|%ID", lead_id)+" ["+totalPrey+"]<br>";
        let hunters = [];
        let hunters_err = false;
        $("#hunt_list_3 > .hunt_list_3_el").each(function(index) {
            let id = $(this).find(".text-short").val().trim();
            if (id !== "") {
                let intid = parseInt(id);
                if (isNaN(intid) || intid != id) {hunters_err = true;}
                else {
                    let prey = parseInt($(this).find(".prey").val()) || 0;
                    hunters.push(masking("[cat%ID]|%ID", id)+" ["+prey+"]");
                    totalPrey += prey;
                }
            }
        });
        txt += "Участники: ";
        txt += (hunters.length) ? hunters.join(", ") : "-";
        txt += "<br>";
        if (hunters_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        let par_list;
        if ($("#hunt_extra_id_3").val().length) {
            par_list = toMaskedArr($("#hunt_extra_id_3").val().trim(), "[cat%ID]|%ID");
            if (par_list.arr.length) {txt += `Помощники: ${par_list.arr.join(", ")}<br>`;}
            if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID помощников; некорректные ID убраны из отчёта.");}
        } else {txt += "Помощники: -<br>";}
        txt += "Локация: "+$("#hunt_place_3").val()+"<br>";
        txt += "Всего поймано: "+totalPrey;
        display_txt($(this).attr("id"), txt);
    });    
    
    $("#create_doz_3").click(function() {/*Тени, дозор*/
        let txt = "Дозор";
        let date = splitDateStr($("#doz_date_3").val());
        if(date) {
            txt += ` [${date.day}.${date.month}.${date.shortYear}]<br>`;
        } else {
            txt += addErr("Ошибка: не выставлена дата.");
        }
        txt += "Место: "+$("#doz_place_3").val()+"<br>";
        let id = parseInt($("#doz_id_3").val().trim());
        let g = ($("input[name='gend_3_3']:checked").val() == 1) ? "ая" : "ый";
        txt += (isNaN(id)) ? addErr("Ошибка: некорректный ID руководящего.") : "Дозорн"+g+": "+masking("[cat%ID] [%ID-актив]", id)+"<br>";
        if ($("#doz_time_3").val()) {
            let time = $("#doz_time_3").val().split(":");
            let hr = parseInt(time[0]); let min = time[1];
            let nextHr = (hr==23) ? 0 : hr+1;
            hr = addLeadZero(hr);
            nextHr = addLeadZero(nextHr);
            txt += `Время: ${hr}:${min}-${nextHr}:${min}<br>`;
        } else {
            txt += addErr("Ошибка: не выставлено время.");
        }
        display_txt($(this).attr("id"), txt);
    });

    $("#create_t_raid_3").click(function() {/*Тени, рейд туннелеров*/
        let txt = "";
        let tip = $("input[name='t_raid_type_3']:checked").val();
        txt += (tip !== undefined) ? `${tip} подземный рейд` : addErr("Ошибка: не выбран вид патруля.");

        let date = splitDateStr($("#t_raid_date_3").val());
        if(date) {
            txt += ` [${date.day}.${date.month}.${date.shortYear}]<br>`;
        } else {
            txt += addErr("Ошибка: не выставлена дата.");
        }
        let totalRes = 0;
        let par_list = toMaskedArr($("#t_raid_id_3").val().trim(), "[[cat%ID]|%ID] [0]");
        txt += (par_list.arr.length) ? `Участники: ${par_list.arr.join(", ")}<br>` : addErr("Ошибка: нет ID участников.");
        txt += `Всего собрано ресурсов: [${$("#res_amt_3").val()}]<br>`;
        let nar = [];
        let nar_err = false;
        $("#t_raid_nar_list_3 > .t_raid_nar_list_3_el").each(function(index) {
            let id = $(this).find(".text-short").val().trim();
            if (id !== "") {
                let intid = parseInt(id);
                if (isNaN(intid) || intid != id) {nar_err = true;}
                else {nar.push(masking("[cat%ID]|%ID", id)+" - "+$(this).find(".nar_txt").val());}
            }
        });
        txt += "Нарушители: ";
        txt += (nar.length) ? nar.join(", ") : "-";
        txt += "<br>";
        if (nar_err) {txt += addErr("Ошибка в одном или нескольких ID нарушителей; некорректные ID убраны из отчёта.");}
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    
    $("#create_s_raid_3").click(function() {/*Тени, рейд пловцов*/
        let txt = "";
        let train = parseInt($("#s_raid_train_id_3").val().trim());
        let g = ($("input[name='gend_4_3']:checked").val() == 1) ? "ша" : "";
        txt += (isNaN(train)) ? addErr("Ошибка: некорректный ID тренера.") : "Тренер"+g+": "+masking("[[cat%ID]|%ID]", train)+" [+5]<br>";
        let watch = parseInt($("#s_raid_watch_id_3").val().trim());
        let add = (train==watch) ? "" : " [+5]";
        g = ($("input[name='gend_5_3']:checked").val() == 1) ? "ая" : "ый";
        txt += (isNaN(watch)) ? addErr("Ошибка: некорректный ID караульного.") : "Караульн"+g+": "+masking("[[cat%ID]|%ID]", watch)+add+"<br>";

        let par_list = toMaskedArr($("#s_raid_id_3").val().trim(), "[[cat%ID]|%ID]");
        txt += (par_list.arr.length) ? `Участники тренировки: ${par_list.arr.join(", ")} [+4]<br>` : addErr("Ошибка: нет ID участников.");
        let nar = [];
        let nar_err = false;
        $("#s_raid_nar_list_3 > .s_raid_nar_list_3_el").each(function(index) {
            let id = $(this).find(".text-short").val().trim();
            if (id !== "") {
                let intid = parseInt(id);
                if (isNaN(intid) || intid != id) {nar_err = true;}
                else {nar.push(masking("[cat%ID]|%ID", id)+" - "+$(this).find(".nar_txt").val());}
            }
        });
        txt += "Замеченные нарушения: ";
        txt += (nar.length) ? nar.join(", ") : "нет";
        if (nar_err) {txt += addErr("Ошибка в одном или нескольких ID нарушителей; некорректные ID убраны из отчёта.");}
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    
    $("#create_s_lect_3").click(function() {/*Тени, лекция пловцов*/
        let txt = "";
        let lect = parseInt($("#s_lect_lead_id_3").val().trim());
        let g = ($("input[name='gend_6_3']:checked").val() == 1) ? "ша" : "";
        txt += (isNaN(lect)) ? addErr("Ошибка: некорректный ID тренера.") : "Лектор"+g+": "+masking("[[cat%ID]|%ID]", lect)+" [+6]<br>";
        let par_list = toMaskedArr($("#s_lect_id_3").val().trim(), "[[cat%ID]|%ID]");
        txt += (par_list.arr.length) ? `Участники лекции: ${par_list.arr.join(", ")}<br>` : addErr("Ошибка: нет ID участников.");
        txt += "Тема: "+$("#s_lect_theme_3").val()+"<br>";
        let nar = [];
        let nar_err = false;
        $("#s_lect_nar_list_3 > .s_lect_nar_list_3_el").each(function(index) {
            let id = $(this).find(".text-short").val().trim();
            if (id !== "") {
                let intid = parseInt(id);
                if (isNaN(intid) || intid != id) {nar_err = true;}
                else {nar.push(masking("[cat%ID]|%ID", id)+" - "+$(this).find(".nar_txt").val());}
            }
        });
        txt += "Нарушения: ";
        txt += (nar.length) ? nar.join(", ") : "нет";
        if (nar_err) {txt += addErr("Ошибка в одном или нескольких ID нарушителей; некорректные ID убраны из отчёта.");}
        if (par_list.mul_id_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });

    $("#create_hran_3").click(function() {/*Тени, патрули хранителей порядка*/
        let date = splitDateStr($("#hran_date_3").val());
        let txt = "";
        if(date) {
            txt += `[b]Горный патруль [${date.day}.${date.month}.${date.shortYear}][/b]<br>`;
        } else {
            txt += addErr("Ошибка: не выставлена дата.");
        }
        let lead = parseInt($("#hran_gath_id_3").val().trim());
        let g = ($("input[name='gend_7_3']:checked").val() == 1) ? "ая" : "ий";
        txt += (isNaN(lead)) ? addErr("Ошибка: некорректный ID собирающего.") : "Собирающ"+g+": "+masking("[[cat%ID]|%ID]", lead)+"<br>";
        lead = parseInt($("#hran_lead1_id_3").val().trim());
        g = ($("input[name='gend_8_3']:checked").val() == 1) ? "ая" : "ий";
        txt += (isNaN(lead)) ? addErr("Ошибка: некорректный ID ведущего 1 части.") : "Ведущ"+g+" первой части: "+masking("[[cat%ID]|%ID]", lead)+" ["+$("input[name='hran_dol1_3']:checked").val()+"]<br>";
        lead = parseInt($("#hran_lead2_id_3").val().trim());
        g = ($("input[name='gend_9_3']:checked").val() == 1) ? "ая" : "ий";
        txt += (isNaN(lead)) ? addErr("Ошибка: некорректный ID ведущего 2 части.") : "Ведущ"+g+" второй части: "+masking("[[cat%ID]|%ID]", lead)+" ["+$("input[name='hran_dol2_3']:checked").val()+"]<br>";
        let uch = [];
        let uch_err = false;
        $("#hran_list_3 > .hran_list_3_el").each(function(index) {
            let id = $(this).find(".hran-id").val().trim();
            if (id !== "") {
                let intid = parseInt(id);
                if (isNaN(intid) || intid != id) {uch_err = true;}//[Оцелотка|4] [c]
                else {uch.push(masking("[[cat%ID]|%ID]", id)+" ["+$(this).find(".dol_type").val()+"]");} 
            }
        });
        txt += "Участники: ";
        txt += (uch.length) ? uch.join(", ") : "-";
        txt += "<br>";
        let nar = [];
        let nar_err = false;
        $("#hran_nar_list_3 > .hran_nar_list_3_el").each(function(index) {
            let id = $(this).find(".text-short").val().trim();
            if (id !== "") {
                let intid = parseInt(id);
                if (isNaN(intid) || intid != id) {nar_err = true;}
                else {nar.push(masking("[[cat%ID]|%ID]", id)+" - "+$(this).find(".nar_txt").val());}
            }
        });
        txt += "Нарушения: ";
        txt += (nar.length) ? nar.join(", ") : "-";
        if (nar_err) {txt += addErr("Ошибка в одном или нескольких ID участников; некорректные ID убраны из отчёта.");}
        if (nar_err) {txt += addErr("Ошибка в одном или нескольких ID нарушителей; некорректные ID убраны из отчёта.");}
        display_txt($(this).attr("id"), txt);
    });
    
    /*ДОП. ФУНКЦИИ*/
    $(function() {//Аккордеон
      var Accordion = function(el, multiple) {
        this.el = el || {};
        this.multiple = multiple || false;
        
        var dropdownlink = this.el.find('.dropdownlink');
        dropdownlink.on('click',
            { el: this.el, multiple: this.multiple },
            this.dropdown);
      };
      
      Accordion.prototype.dropdown = function(e) {
        var $el = e.data.el,
            $this = $(this),
            $next = $this.next();
        $next.slideToggle();
        $this.parent().toggleClass('open');
        if(!e.data.multiple) {
          $el.find('.submenuItems').not($next).slideUp().parent().removeClass('open');
        }
      };
      var accordion = new Accordion($('.accordion-menu'), false);
    });
    $(".patr-type_0").one('click',function() {//Река
        $(".patr_id").slideDown();
        $("#create_patr").prop('disabled', false);
    });
    $("input[name='patr_type']").change(function() {//Река
        let id = "#data_"+$("input[name='patr_type']:checked").attr('id');
        $(".active").slideUp(200).removeClass("active");
        $(id).addClass('active').slideDown(200);
        if (id == "#data_hunt") {
            $(".patr_id_hunt").addClass('active').slideDown();
        }
        else {
            $(".patr_id_hunt").removeClass('active').slideUp();
        }
    });
    $("input[name='patr_type_3']").change(function() {//Доп. поле на патрулях Теней
        let val = $(this).val();
        $('.patr_sett_pogr_3').slideUp();
        $('.patr_sett_pogr_3[data-bind="'+val+'"]').slideDown();
    });
    $("input[name='marsh_num_3']").change(function() {//Доп. поле на патрулях Теней
        if ($(this).val() == "III") {
            $('#pogr_3_flower').slideDown();
        } else {
            $('#pogr_3_flower').slideUp();
        }
    });
    $("#label_moss_3_1").click(function() {$("#moss_amt_3").val(1);$("#wmoss_amt_3").val(8);});/*Автоматическое выставление количества мха (Тени)*/
    $("#label_moss_3_2").click(function() {$("#moss_amt_3").val(12);$("#wmoss_amt_3").val(0);});
    $("#label_moss_3_3").click(function() {$("#moss_amt_3").val(8);$("#wmoss_amt_3").val(4);});
    $("input[name='hunt_type_3']").change(function() {
        let ischkd = ($(this).val()=="Дневной") ? true : false;
        $(".hunt-nigt-only-3").prop("disabled", ischkd);
    });
    $(".copy-my-id").click(function() {/*Тени: копировать айди собирающего*/
        let id = $("#"+$(this).attr("orig-id")).val();
        $("#"+$(this).attr("data-id")).val(id);
    });
    $("input[name='doz_type_4']").change(function() {//Галочка на дозорах Луны
        if ($(this).val()=="сидячий") $("#sit_4_extra").slideDown();
        else $("#sit_4_extra").slideUp();
    });
    $(".gend-enable:not(.no-cash)").change(function() {/*Пол пишущего отчёт. Зачем вам писать пол? Зачем в отчёте разница между собирающим и собирающей? Зачем. Зачем. Зачем. Не читай это. Зачем ты лезешь в код. Уходи. Я буду плакать.*/
        let maxage = 60*60*24*365;
        document.cookie = "gen="+$(this).val()+"; max-age="+maxage;
    });
    
    

    
    
    
});
