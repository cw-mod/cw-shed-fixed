$(document).ready(function(){
        $('input[value="'+$('input[name=tribe]:checked').val()+'"]').prop('checked', true);
        $("#"+$('input[name=tribe]:checked').attr('id')+"-div").addClass("selected");
        timeget();
    $('#isSwimmer input').on('change', function() {
        $("#isSwimmer .option").removeClass("selected");
        $("#"+$('input[name=tribe]:checked').attr('id')+"-div").addClass("selected");
        timeget();
        $.ajax({
    		type: "POST",
    		url: "setcookie.php",
    		data: "tribe="+$('input[name=tribe]:checked').val()
    	});
    	return false;
    });
    $('.mobile .lvl').on('input', function(e) {$(this).val(e.originalEvent.data);});
    /*$('.fract').on('input', function() {
        fid = "#"+$(this).attr('id').replace(/1/, "2");
        if (parseInt($(this).val()) >= parseInt($(fid).val())) {
            $(this).val($(fid).val()-1);
        }
    });*/
    $('#isSwimmer input').change(timeget);
    $('#userSL, #locSL').on('input', timeget);
    $('#far .lvl').on('input', function() {
        let id =$(this).attr('id');
        const tblSL = [1, 4, 15, 30, 150, 300, 500, 2000, 7000, "INF"];
        let fract_value = tblSL[$(this).val()];
        $("#d2"+id).val(fract_value);//Дробь
        if (fract_value != "INF") {//Макс в дроби
            $("#d1"+id).attr('max', fract_value-1);
        } else {
            $("#d1"+id).removeAttr('max');
        }
        bid = "#d1"+id;
        eid = "#d2"+id;
        if (parseInt($(bid).val()) >= parseInt($(eid).val())) {
            $(bid).val($(eid).val()-1);
        }
    });
    $('#farform').submit(function(e) {
        e.preventDefault();
        frlvl = parseInt($('#bSL').val());
        tolvl = parseInt($('#eSL').val());
        frfract = parseInt($('#d1bSL').val());
        tofract = parseInt($('#d1eSL').val());
        k = parseFloat($('input[name=tribe]:checked').val());
        const tblSL = [1, 4, 15, 30, 150, 300, 500, 2000, 7000, "INF"];
        //ты = (туннелер) ? мужик : не мужик;
        if ((frlvl>tolvl)||((frlvl==tolvl)&&(frfract>=tofract))) {
            $("#howFar").html("До "+tolvl+" "+tofract+"/"+$('#d2eSL').val()+" ПУ <b>0 с</b>");
            return false;
        }
        total = 0;
        totalact = 0;
        if (tolvl==9) {
            tolvl=8;
            tofract=7000;
        }
        for (i = frlvl; i <= tolvl; i++) {
            lv = (i===0) ? 1 : i;    
            acta = (lv > 3) ? (lv*(lv-2-k)) : (lv);
            actt = Math.round(300 / (1 + k) / lv);
            total += tblSL[i]*acta*actt;
            totalact += tblSL[i]*acta;
        }
        acta = (frlvl > 3) ? (frlvl*(frlvl-2-k)) : (frlvl);
        actt = Math.round(300 / (1 + k) / frlvl);
        tmp = frfract*acta*actt;
        total -= (tmp) ? (tmp) : 0;
        totalact -= frfract*acta;
        acta = (tolvl > 3) ? (tolvl*(tolvl-2-k)) : (tolvl);
        actt = Math.round(300 / (1 + k) / tolvl);
        tmp = (tblSL[tolvl]-tofract)*acta*actt;
        total -= (tmp) ? (tmp) : 0;
        totalact -= (tblSL[tolvl]-tofract)*acta;
        $("#howFar").html("До "+$('#eSL').val()+" "+$('#d1eSL').val()+"/"+$('#d2eSL').val()+" ПУ <b>"+timeconvert(total)+"</b>.");
        $("#howMuch").html("Всего <b>"+totalact+"</b> действий.");
        days = total / 3600 / parseFloat($('#hourExp').val());  
        f = ( (days.toString().includes('.')) ? (days.toString().split('.').pop().length) : (0) );
        if (f > 2) {days = days.toFixed(2);}
        days = (days < 1) ? "менее 1 дня" : days+" дней";
        actt = Math.round((300 / (1 + k)) * (llv / plv));
        $("#howLong").html("Кач по "+$('#hourExp').val()+" часов в день<br>займет "+days+".");
        $("#far .ans").css('opacity', 1); //fuck IE
    });
});
function timeconvert(num) {
    str = "";
    hr = parseInt(num / 3600);
    mi = parseInt((num - hr*3600) / 60);
    se = parseInt(num - (hr*3600 + mi*60));
    str += ((hr) ? hr+" ч " : "" );
    str += ((mi) ? mi+" м " : "" );
    str += ((se) ? se+" с" : "" );
    return str.trim();
}
function timeget() {
    if ($('#locSL:valid').val() === undefined || $('#userSL:valid').val() === undefined || $('#locSL:valid').val() === "" || $('#userSL:valid').val() === "") {return;}
    k = parseFloat($('input[name=tribe]:checked').val());
    llv = $('#locSL').val();
    plv = $('#userSL').val();
    if ($('#locSL').val()=="0") {llv=1;}
    if ($('#userSL').val()=="0") {plv=1;}
    acta = (plv>3) ? plv/llv*(plv-2-k) : plv/llv;
    f = ( (acta.toString().includes('.')) ? (acta.toString().split('.').pop().length) : (0) );
    if (f > 2) {acta = acta.toFixed(2);}
    actt = Math.round((300 / (1 + k)) * (llv / plv));
    $("#actTime").html(timeconvert(actt));
    $("#actAmt").html(acta);
}

