function getCookie(name) {
    let matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}
function setCookie(name, val) {
    maxage = 60*60*24*365;
    document.cookie = name+"="+val+"; max-age="+maxage;
}
function timeConvert(num) {
    str = "";
    hr = parseInt(num / 3600);
    mi = parseInt((num - hr*3600) / 60);
    se = parseInt(num - (hr*3600 + mi*60));
    str += ((hr) ? hr+" ч " : "" );
    str += ((mi) ? mi+" м " : "" );
    str += ((se) ? se+" с" : "" );
    return str.trim();
}

function showSwimTime() {
    let llv = $("#locLv").val(),
    ylv = $("#yourLv").val(),
    acta = (ylv > 3) ? (ylv / llv * (ylv - (mod + 2))) : (ylv / llv),
    frac = ( (acta.toString().includes('.')) ? (acta.toString().split('.').pop().length) : (0) );
    if (frac > 2) {acta = acta.toFixed(2);}
    actt = Math.round((300 / (1 + mod)) * (llv / ylv));
    $("#actTime").text(timeConvert(actt));
    $("#actAmt").text(acta);
}

var mod = getCookie("swim_mod");
mod = (mod === undefined) ? 0 : parseFloat(mod);

$(document).ready(function(){
    // for starters
    showSwimTime();
    $(".multiplier-choose > input[value='"+mod+"']").prop("checked", true);

    // the juice
    $("input[name=tribe]").change(function() {
        let val = parseFloat($(this).val());
        if (mod != val) {
            mod = val;
            setCookie("swim_mod", mod);
            showSwimTime();
        }
    });
    $("#yourLv, #locLv").change(function() {
        showSwimTime();
    });
    $("#bSL, #eSL").change(function() {
        let id =$(this).attr('id'),
        tblSL = [1, 4, 15, 30, 150, 300, 500, 2000, 7000, "INF"],
        fract_value = tblSL[$(this).val()];
        $("#d2"+id).val(fract_value);//Дробь
        if (fract_value != "INF") {//Макс в дроби
            $("#d1"+id).attr('max', fract_value-1);
        } else {
            $("#d1"+id).removeAttr('max');
        }
        bVal = parseInt($("#d1"+id).val());
        eVal = parseInt($("#d2"+id).val());
        if (bVal >= eVal) {
            $("#d1"+id).val(eVal - 1);
        }
    });
    $("#howFar").click(function() {
        let frlvl = parseInt($('#bSL').val()),
        tolvl = parseInt($('#eSL').val()),
        frfract = parseInt($('#d1bSL').val()),
        tofract = parseInt($('#d1eSL').val()),
        total = 0,
        totalact = 0,
        lvTable = [1, 4, 15, 30, 150, 300, 500, 2000, 7000, 0],
        tmp;
        //ты = (туннелер) ? мужик : не мужик;
        if ((frlvl>tolvl)||((frlvl==tolvl)&&(frfract>=tofract))) {
            $("#howFarRes").html(`<p class="my-0 my-lg-2">От ${frlvl} ${frfract}/${$('#d2bSL').val()} ПУ до ${tolvl} ${tofract}/${$('#d2eSL').val()} ПУ <b>0 с</b></p>`);
            return false;
        }
        if (tolvl == 9) { lvTable[9] = tofract + 1;}
        for (i = frlvl; i <= tolvl; i++) {
            let lv = (!i) ? 1 : i,    
            acta = (lv > 3) ? (lv*(lv-2-mod)) : (lv),
            actt = Math.round(300 / (1 + mod) / lv);
            total += lvTable[i]*acta*actt;
            totalact += lvTable[i]*acta;
        }
        acta = (frlvl > 3) ? (frlvl*(frlvl-2-mod)) : (frlvl);
        actt = Math.round(300 / (1 + mod) / frlvl);
        tmp = frfract*acta*actt;
        total -= (isNaN(tmp)) ? 0 : tmp;
        totalact -= frfract*acta;
        acta = (tolvl > 3) ? (tolvl*(tolvl-2-mod)) : (tolvl);
        actt = Math.round(300 / (1 + mod) / tolvl);
        tmp = (lvTable[tolvl]-tofract)*acta*actt;
        total -= (isNaN(tmp)) ? 0 : tmp;
        totalact -= (lvTable[tolvl]-tofract)*acta;
        days = total / 3600 / parseFloat($('#hourExp').val());   
        let f = ( (days.toString().includes('.')) ? (days.toString().split('.').pop().length) : (0) );
        if (f > 2) {days = days.toFixed(2);}
        days = (days < 1) ? "менее 1 дня" : days+" дней";
        $("#howFarRes").html(`  
              <p class="my-0 my-lg-2">От ${frlvl} ${frfract}/${$('#d2bSL').val()} ПУ до ${tolvl} ${tofract}/${$('#d2eSL').val()} ПУ <b>${timeConvert(total)}</b></p>
              <p class="my-2">Всего действий: <b>${totalact}</b></p>
              <p class="my-2">Кач по <b>${$('#hourExp').val()} часов</b> в день займет <b>${days}</b></p>`);
    });
});
