var cards

var xhr = new XMLHttpRequest()
xhr.open('GET', '/tmp/cards', false)
xhr.send()
if(xhr.status!=200){
	alert(xhr.status+': '+ xhr.statusText)
}
else{
	cards = JSON.parse(xhr.responseText)
}

function integerDivision(x, y){
    return (x-x%y)/y
}
function newItem(item){
	var currentDiv = document.querySelector('div[data-tab-id = ' + item.cardClass + ']')
	var newDiv = document.createElement("div")
	var att1 = document.createAttribute("class")
	att1.value = "card-image-item"
	var att2 = document.createAttribute("data-name")
	att2.value = item.cardName
	var att3 = document.createAttribute("data-rarity")
	att3.value = item.cardRarity
	newDiv.setAttributeNode(att1)
	newDiv.setAttributeNode(att2)
	newDiv.setAttributeNode(att3)
	var newImg = document.createElement("img")
	var att4 = document.createAttribute("src")
	att4.value = item.cardImg
	var att5 = document.createAttribute("height")
	att5.value = "237"
	var att6 = document.createAttribute("width")
	att6.value = "168"
	var att7 = document.createAttribute("style")
	att7.value = "vertical-align: top;"
	newImg.setAttributeNode(att4)
	newImg.setAttributeNode(att5)
	newImg.setAttributeNode(att6)
	newImg.setAttributeNode(att7)
	newDiv.appendChild(newImg)
	currentDiv.appendChild(newDiv)
}

function countCards(arr, hclass){
	var s = 0;
	arr.forEach(function(item, i, arr){
		if (item.cardClass == hclass)
			s++
	})
	s = integerDivision(s, 6) + 1
	return s
}

function otherClass (str){
	var att = document.createAttribute("style")
	var att1 = document.createAttribute("style")
	att.value = "display: block"
	att1.value = "display: none"
	var doc = document.querySelector('.contentPlace')
	oldClass = doc.dataset.currentClass
	var doc1 = document.querySelector('#' + oldClass)
	doc1.setAttributeNode(att1)
	var doc2 = document.querySelector('#'+ str)
	doc2.setAttributeNode(att)
	doc.dataset.currentClass = str
}


function backward(){
	var doc = document.querySelector('.contentPlace')
	oldClass = doc.dataset.currentClass
	var currentDiv = document.querySelector('div[data-tab-id = '+ oldClass + ' ]')
	num = parseInt(currentDiv.style.width, 10)
	var att1 = document.createAttribute("style")
	att1.value = "left: " + (parseInt(currentDiv.style.left, 10) + 564) + "px; width: " + currentDiv.style.width
	currentDiv.setAttributeNode(att1)
}

function forward(){
	var doc = document.querySelector('.contentPlace')
	oldClass = doc.dataset.currentClass
	var currentDiv = document.querySelector('div[data-tab-id = '+ oldClass + ' ]')
	var att1 = document.createAttribute("style")
	att1.value = "left: " + (parseInt(currentDiv.style.left, 10) - 564) + "px; width: " + currentDiv.style.width	
	currentDiv.setAttributeNode(att1)
}

function countDivs(){
	var att1 = document.createAttribute("style")
	var att2 = document.createAttribute("style")
	var att3 = document.createAttribute("style")
	var att4 = document.createAttribute("style")
	var att5 = document.createAttribute("style")
	var att6 = document.createAttribute("style")
	var att7 = document.createAttribute("style")
	var att8 = document.createAttribute("style")
	var att9 = document.createAttribute("style")
	var att = document.createAttribute("style")
	var currentDiv = document.querySelector('div[data-tab-id = "Neutral"]')
	att1.value = "left: 0; width: " + countCards(cards, 'Neutral')*760 +"px"
	currentDiv.setAttributeNode(att1)
	var currentDiv1 = document.querySelector('div[data-tab-id = "Warrior"]')
	att2.value = "left: 0; width: " + countCards(cards, 'Warrior')*760 +"px"
	currentDiv1.setAttributeNode(att2)
	var currentDiv2 = document.querySelector('div[data-tab-id = "Mage"]')
	att3.value = "left: 0; width: " + countCards(cards, 'Mage')*760 +"px"
	currentDiv2.setAttributeNode(att3)
	var currentDiv3 = document.querySelector('div[data-tab-id = "Druid"]')
	att4.value = "left: 0; width: " + countCards(cards, 'Druid')*760 +"px"
	currentDiv3.setAttributeNode(att4)
	var currentDiv4 = document.querySelector('div[data-tab-id = "Shaman"]')
	att5.value = "left: 0; width: " + countCards(cards, 'Shaman')*760 +"px"
	currentDiv4.setAttributeNode(att5)
	var currentDiv5 = document.querySelector('div[data-tab-id = "Hunter"]')
	att6.value = "left: 0; width: " + countCards(cards, 'Hunter')*760 +"px"
	currentDiv5.setAttributeNode(att6)
	var currentDiv6 = document.querySelector('div[data-tab-id = "Rogue"]')
	att7.value = "left: 0; width: " + countCards(cards, 'Rogue')*760 +"px"
	currentDiv6.setAttributeNode(att7)
	var currentDiv7 = document.querySelector('div[data-tab-id = "Priest"]')
	att8.value = "left: 0; width: " + countCards(cards, 'Priest')*760 +"px"
	currentDiv7.setAttributeNode(att8)
	var currentDiv8 = document.querySelector('div[data-tab-id = "Paladin"]')
	att9.value = "left: 0; width: " + countCards(cards, 'Paladin')*760 +"px"
	currentDiv8.setAttributeNode(att9)
	var currentDiv9 = document.querySelector('div[data-tab-id = "Warlock"]')
	att.value = "left: 0; width: " + countCards(cards, 'Warlock')*760 +"px"
	currentDiv9.setAttributeNode(att)
	
}

function showCards(cards){
	countDivs();
	cards.forEach(function(item, i, arr){
		newItem(item)
	})
}

window.onload = showCards(cards);

function countDivsAfter(cards){
	var currentDiv = document.querySelector('[data-tab-id = "Neutral"]')
	currentDiv.style.width = (countCards(cards, 'Neutral')*760)
	var currentDiv = document.querySelector('[data-tab-id = "Warrior"]')
	currentDiv.style.width = (countCards(cards, 'Warrior')*760)
	var currentDiv = document.querySelector('[data-tab-id = "Mage"]')
	currentDiv.style.width = (countCards(cards, 'Mage')*760)
	var currentDiv = document.querySelector('[data-tab-id = "Druid"]')
	currentDiv.style.width = (countCards(cards, 'Druid')*760)
	var currentDiv = document.querySelector('[data-tab-id = "Shaman"]')
	currentDiv.style.width = (countCards(cards, 'Shaman')*760)
	var currentDiv = document.querySelector('[data-tab-id = "Hunter"]')
	currentDiv.style.width = (countCards(cards, 'Hunter')*760)
	var currentDiv = document.querySelector('[data-tab-id = "Rogue"]')
	currentDiv.style.width = (countCards(cards, 'Rogue')*760)
	var currentDiv = document.querySelector('[data-tab-id = "Priest"]')
	currentDiv.style.width = (countCards(cards, 'Priest')*760)
	var currentDiv = document.querySelector('[data-tab-id = "Paladin"]')
	currentDiv.style.width = (countCards(cards, 'Paladin')*760)
	var currentDiv = document.querySelector('[data-tab-id = "Warlock"]')
	currentDiv.style.width = (countCards(cards, 'Warlock')*760)
}
