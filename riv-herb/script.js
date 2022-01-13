function addLeadZero(num) {
	return num < 10 ? '0' + num : num;
}
function error(message) {
	$('#additional_output').val($('#additional_output').val() + message + '\n');
}
function dateToStr(date) {
	return date.getFullYear() 
	+ '-' + addLeadZero(date.getMonth()+1) 
	+ '-' + addLeadZero(date.getDate());
}
function dt_format(date) {
	return addLeadZero(date.getDate())
	+ '.' + addLeadZero(date.getMonth()+1); 
}
function addCat(patr_arr, cat, date, type, mark_filled = false) {
	const instance = _.find(patr_arr, {year: date.getFullYear(), month: date.getMonth(), day: date.getDate(), type: type});
	const date_str = `${addLeadZero(date.getDate())}.${addLeadZero(date.getMonth() + 1)}.${date.getFullYear()} (${type})`;
	if (!instance) {
		error(`Попытался запихнуть ${cat} в патруль ${date_str}, но подходящий патруль не был найден. Некорректная дата комментария, наверное слишком поздно или слишком рано отпись.`);
	} else if (instance.cats_filled) {
		error(`Попытался запихнуть ${cat} в патруль ${date_str}, но на этот патруль коты уже заполнялись. Где-то подвох (видимо, травник отписали не в тот же день, что провели).`);
	} else if (instance.cats.includes(cat)) {
		error(`Попытался запихнуть ${cat} в патруль ${date_str}, он уже в нём состоит.`);
	} else {
		instance.cats.push(cat);
		if (mark_filled) {
			instance.cats_filled = true;
		}
	}
}

function format(array, mask) {
	let string = '', new_array = [];
	for (let i in array) {
		new_array.push(mask.replace(/%ID%/g, array[i]))
	}
	return new_array
}

$(document).ready(function() {
	var date = new Date();
	if (date.getDay() != 6) { // Суббота
		date.setDate(date.getDate() - date.getDay() - 1);
	}
	$('#date').val(dateToStr(date));

	$('#count').click(function() {
		date = new Date($('#date').val());
		var patr = [];
		const thisFri = new Date(date);
		$('#additional_output').val('');
		thisFri.setDate(thisFri.getDate() - 1);
		thisFri.setHours(17);
		const lastWeek = new Date(thisFri);
		lastWeek.setDate(lastWeek.getDate() - 6);
		lastWeek.setHours(11);
		while (lastWeek <= thisFri) {
			const hours_assoc = {
				'11': 'веточник',
				'16': 'травник',
				'17': 'мховник'
			};
			const cur = lastWeek.getHours();
			patr.push({
				year: lastWeek.getFullYear(),
				month: lastWeek.getMonth(),
				day: lastWeek.getDate(),
				hour: lastWeek.getHours(),
				type: hours_assoc[cur],
				cats: [],
				cats_filled: false,
			});
			if (cur == 11) {
				lastWeek.setHours(cur + 5);
			} else if (cur == 16) {
				lastWeek.setHours(cur + 1);
			} else {
				lastWeek.setHours(cur + 18);
			}
		}
		lastWeek.setDate(lastWeek.getDate() - 7);
		lastWeek.setHours(11);
		const months = {
			"января": 0, 
			"февраля": 1, 
			"марта": 2, 
			"апреля": 3, 
			"мая": 4, 
			"июня": 5, 
			"июля": 6, 
			"августа": 7, 
			"сентября": 8, 
			"октября": 9, 
			"ноября": 10, 
			"декабря": 11
		};
		var comments = $('#comments').val().split('\n'), comment_date, patr_date = new Date(), patr_type, comment_num;
		for (const string_i in comments) {
			var string = comments[string_i];
			if (!string.length
				|| ['Ответить | Цитировать', 'Ответить', 'Цитировать'].includes(string)
				|| /^Особые происшествия/i.test(string)) {
				continue;
			}
			if (string[0] == '#') {
				let strdate = string.split(' @ ')[0].trim();
				comment_num = string.match(/^#(\d+)/)[1];
				strdate = strdate.replace(/^#\d+ /, '');
				strdate = strdate.split(' в ');
				let strday = strdate[0], strtime = strdate[1];
				if (strday.indexOf('Сегодня') != -1) {
					const today = new Date();
					strday = dateToStr(today);
				} else if (strday.indexOf('Вчера') != -1) {
					let yesterday = new Date();
					yesterday.setDate(yesterday.getDate() - 1);
					strday = dateToStr(yesterday);
				} else {
					let today = new Date();
					let re = strday.match(/(\d+) ([а-я]+) ?(\d+)?/);
					today.setDate(1);
					today.setMonth(months[re[2]]);
					today.setDate(re[1]);
					if (re[3]) {
						today.setFullYear(re[3]);
					}
					strday = dateToStr(today);
				}
				strtime = strtime.split(':');
				comment_date = new Date(strday);
				comment_date.setHours(strtime[0]);
				comment_date.setMinutes(strtime[1]);
			} else if (/^Тип травника:/u.test(string)) {
				let re = string.match(/^Тип травника: ?([А-яЁё]+);?/);
				if (!re || !re[1]) {
					return error(`Что-то не так с типом травника в комменте #${comment_num}. Строчка выглядит как "${string}".`);
				}
				patr_type = re[1].trim();
				if (!['веточник', 'травник', 'мховник'].includes(patr_type)) {
					error(`Что-то не так с типом травника в комменте #${comment_num}. Строчка выглядит как "${string}".`);
				} else {

				}
			} else if (/^Ведущий/u.test(string)) {
				let leader = +(string.replace(/\D+/g, ''));
				addCat(patr, leader, comment_date, patr_type);
			} else if (/^Участники/u.test(string)) {
				let ids = string.match(/\d+/g);
				for (const id_i in ids) {
					const id = +ids[id_i];
					const last = (ids.length == +id_i + 1);
					addCat(patr, id, comment_date, patr_type, last);
				}
			}
		}
		var missing = [];
		for (const i in patr) {
			const cur = patr[i];
			if (cur.cats.length == 0) {
				const date = new Date(cur.year, cur.month, cur.day)
				missing.push({date: dt_format(date), type: cur.type})
			}
		}
		if (missing.length) {
			error('Не отписаны/не собраны патрули:');
			for (const i in missing) {
				const cur = missing[i];
				let str = `${cur.date} (${cur.type})`;
				error(str);
			}
		}
		const count = [];
		for (const i in patr) {
			const cur = patr[i];
			const points = (cur.type == 'травник') ? 1.5 : 1;
			for (const c_i in cur.cats) {
				const now = cur.cats[c_i];
				const instance = _.find(count, {id: now});
				if (!instance) {
					count.push({id: now, points});
				} else {
					instance.points += points;
				}
			}
		}
		count.sort(function(a, b) {return b.points - a.points});
		let val = `Подсчёт травников [${addLeadZero(date.getDate())}.${addLeadZero(date.getMonth()+1)}]:\n`;
		for (const i in count) {
			const cat = count[i];
			val += `${cat.id}	${cat.points}\n`;
		};

		val += `\n\nАктивисты:`;
		let first = count[0], first_gr = [first.id], i = 1, second = count[i], second_gr = [];
		while (first.points == second.points) {
			first_gr.push(second.id);
			second = count[++i];
		}
		second_gr.push(second.id);
		let third = count[++i];
		while (second.points == third.points) {
			second_gr.push(third.id);
			third = count[++i];
		}
		
		val += `\nI группа: ${(format(first_gr, '[cat%ID%] [%ID%]')).join(', ')};`;
		val += `\nII группа: ${(format(second_gr, '[cat%ID%] [%ID%]')).join(', ')}.`;
		$('#output').val(val);
	});
});
