"use strict"; 
var eventlist=[];var finishlist=[];
var longClick;var timeOutEvent;
var itemnum=0;var finishnum=0;
var view="all";
var content;var recordi=0;
//关闭或刷新时数据保存到本地
function leave()
{
	localStorage.setItem("eventlist",eventlist);
	localStorage.setItem("finishlist",finishlist);
}
//修正从localstorage接受的list数据
function change(list)
{
	var newlist=[];
	var str="";
	for(var i=0;i<list.length;i++)
	{
		if(list[i]!=',')
		{
			str+=list[i]
		}
		if(list[i]==','||i==list.length-1)
		{
			newlist.push(str)
			str=""
		}
	}
	return newlist;
	
}
//适合boolean的list的修正
function change2(list)
{
	var newlist=[];
	var str="";
	for(var i=0;i<list.length;i++)
	{
		if(list[i]!=',')
		{
			str+=list[i]
		}
		if(list[i]==','||i==list.length-1)
		{
			if(str=="true")
			{
				newlist.push(true);
			}
			else if(str=="false")
			{
				newlist.push(false);
			}
			str=""
		}
	}
	return newlist;
	
}
//点击使事件的编辑状态取消
function bodyclick()
{
	console.log("bodyclick");
	var input=document.querySelector(".txt")
	if(!input)return;
	var father=input.parentNode;
	var ps=father.getElementsByClassName("find")
	var p=ps[0]
		if(input.value.length == 0){
			p.innerHTML = content;
			p.style.visibility="visible";
			father.removeChild(input)
			alert("事件不得为空");
		}
		else{
			p.innerHTML=input.value;
			p.style.visibility="visible";
			father.removeChild(input);
			eventlist[recordi]=input.value;
		}

	  var deleteimg=father.getElementsByTagName("img")
       deleteimg[0].classList.add("hidden");
	   deleteimg[0].classList.remove("show");
	
}
window.onload = function() {
	eventlist=localStorage.eventlist
	finishlist=localStorage.finishlist
	if(typeof(eventlist) == "undefined")
	{
		eventlist=[]
	}
	else{
		eventlist=change(eventlist)
	}
	if(typeof(finishlist) == "undefined")
	{
		finishlist=[]
	}
	else{
		finishlist=change2(finishlist)
	}
	document.querySelector("body").onbeforeunload=leave;
	document.querySelector("html").addEventListener("touchstart",bodyclick,false)
	document.getElementById("selectall").addEventListener("touchstart",selectall,false);
	update();
	var addtodo=document.querySelector("#addtodo")
	addtodo.addEventListener('keyup', function(ev) {
    // Enter
    if (ev.keyCode != 13) return;
    var msg = addtodo.value;
    if (msg == '') {
      console.warn('msg is empty');
      return;
    }
	eventlist.unshift(msg);
	finishlist.unshift(false);
	update();
	addtodo.value=""
  }, false);
        var lefts=document.querySelectorAll(".leftspan");
		for(var i=0;i<lefts.length;i++)
		{
			lefts[i].addEventListener("click",changeview(i),false);
		}
	var clear=document.querySelector(".rightspan")
	clear.addEventListener("touchstart",clearfinish,false)
    
    
}
function update()
{
    itemnum=0;finishnum=0;
	var itemlist=document.querySelector("#list")
	itemlist.innerHTML="";//清空原列表
	for(var i=0;i<eventlist.length;i++)
	{
		var li=document.createElement("li");
		li.id="li_"+itemnum;
		var input=document.createElement("input")
		input.type="checkbox";
		input.classList.add("item-checkbox")
		input.id="check_"+itemnum;
		if(finishlist[i]==true)
		{
			input.checked="true";finishnum++;
		}
		//设置checkbox点击事件
		var label=document.createElement('label');
		label.setAttribute("for","check_"+itemnum);
		label.addEventListener('click', 
          finish("li_"+itemnum), false);
		var p=document.createElement("p");
		p.id="p_"+itemnum;
		p.classList.add("find")
		var s="p_"+itemnum
		p.innerText=eventlist[i];
		//设置p点击编辑事件
		$(p).on({
        touchstart: function(e) { 
		    console.log("touch");
		    longClick=0;
            // 长按事件触发  
			var id=$(this).attr("id")
            timeOutEvent = setTimeout(function() {
				
                  var index=parseInt(id.replace("p_",""))
				  edit(index);
						longClick=1;
            }, 400);  
            //长按400毫秒   
            
        },  
        touchmove: function() {  
            clearTimeout(timeOutEvent);  
            timeOutEvent = 0;     
        },  
        touchend: function() {  
            clearTimeout(timeOutEvent);  
            if (timeOutEvent != 0&&longClick==0) {  
                // 点击事件  
                // location.href = '/a/live-rooms.html';  
                //alert('你点击了');  
            }  
            return false;  
        }  
    }) 
	//删除按钮，默认隐藏
		var deleteimg=document.createElement('img');
		deleteimg.src="images/delete.png";
		deleteimg.alt="delete";
		deleteimg.addEventListener('touchstart', 
          removeitem("li_"+itemnum), false);
		deleteimg.classList.add("hidden");
		deleteimg.classList.remove("show");
		li.appendChild(input);
		li.appendChild(label)
		li.appendChild(p);
		li.appendChild(deleteimg);
		if(view=="active")
		{
			if(finishlist[i]==true)
			{
				li.style.display="none";
			}
			else
				li.style.display="";
		}
		if(view=="finished")
		{
			if(finishlist[i]==false)
			{
				li.style.display="none";
			}
			else
				li.style.display="";
		}
		if(view=="all")
		{
			li.style.display="";
		}
		itemlist.appendChild(li);
		itemnum++;
	}
	if(itemnum==finishnum)
	{
		var se=document.getElementById("selectall")
		se.src="images/finished.png"
		se.style.visibility="visible"
	}
	if(itemnum!=finishnum)
	{
		var se=document.getElementById("selectall")
		se.src="images/notfinished.png"
		se.style.visibility="visible"
	}
	if(itemnum==0)
	{
		document.getElementById("selectall").style.visibility="hidden"
	}
	//设置显示item数量
	if(view=="active")
	{
		document.querySelector("#count").innerHTML=""+(itemnum-finishnum);
	}
	if(view=="all")
	{
		document.querySelector("#count").innerHTML=""+itemnum;
	}
	if(view=="finished")
	{
		document.querySelector("#count").innerHTML=""+finishnum;
	}
	//footer区域事件添加
	if(itemnum==0)
	{
		itemlist.innerHTML="请添加事件"
		var lefts=document.querySelectorAll(".leftspan.choose");
		for(var i=0;i<lefts.length;i++)
		{
			lefts[i].classList.remove("choose")
			lefts[i].classList.add("notchoose")
		}
		view="all";
	}
	else{
		var lefts=document.querySelectorAll(".leftspan");
		if(view=="all")
		{
			lefts[0].classList.remove("notchoose")
			lefts[0].classList.add("choose")
			lefts[1].classList.remove("choose")
			lefts[1].classList.add("notchoose")
			lefts[2].classList.remove("choose")
			lefts[2].classList.add("notchoose")
		}
		if(view=="active")
		{
			lefts[0].classList.remove("choose")
			lefts[0].classList.add("notchoose")
			lefts[1].classList.remove("notchoose")
			lefts[1].classList.add("choose")
			lefts[2].classList.remove("choose")
			lefts[2].classList.add("notchoose")
		}
		if(view=="finished")
		{
			lefts[0].classList.remove("choose")
			lefts[0].classList.add("notchoose")
			lefts[1].classList.remove("choose")
			lefts[1].classList.add("notchoose")
			lefts[2].classList.remove("notchoose")
			lefts[2].classList.add("choose")
		}
	}
	
	
	
	
}
//召唤出edit框的函数，进入某件事的编辑状态
function edit(i)
{
	recordi=i;//全局点击取消编辑用到recordi
	var li=document.getElementById("li_"+i);
	var p = document.getElementById("p_"+i);
	content= p.innerHTML;
	var input=document.createElement("input");
	//删除按钮显示
	var deleteimg=li.getElementsByTagName("img")
	deleteimg[0].classList.add("show");
		deleteimg[0].classList.remove("hidden");
	input.id="input_"+i;input.value=content;
	input.classList.add("txt")
	input.addEventListener("touchstart",function()
	{
		event.stopPropagation();//阻止传递到全局点击
	}
	,false)
	//p.innerHTML="<input id='input_"+i+"' value='"+content+"' />";
	li.insertBefore(input,p)
	p.innerHTML="1"
	p.style.visibility="hidden"
	//input.setSelectionRange(0,input.value.length);
	input.focus();
	//回车输入事件添加
	input.addEventListener( "keyup",function(){
		console.log("keyup");
		if (event.keyCode != 13) return;
		if(input.value.length == 0){
			p.innerHTML = content;
			p.style.visibility="visible";
			li.removeChild(input)
			alert("事件不得为空");
		}
		else{
			p.innerHTML=input.value;
			p.style.visibility="visible";
			eventlist[i]=input.value;
			li.removeChild(input);
		}

      // 删除按钮隐藏
       deleteimg[0].classList.add("hidden");
	   deleteimg[0].classList.remove("show");

		
	},false);	
}
//对应footer区域的事件
function changeview(i)
{
	return function()
	{
		if(i==0)
		{
			view="all"
		}
		if(i==1)
		{
			view="active"
		}
		if(i==2)
		{
			view="finished"
		}
		update();
	}
}
//删除一件事情
function removeitem(id)
{
	return function()
	{
	var index=parseInt(id.replace("li_",""));
	eventlist.splice(index,1)
	finishlist.splice(index,1)
	update();
	}
}
//标志某件事完成
function finish(id)
{
	return function()
	{
		var index=parseInt(id.replace("li_",""));
		if(finishlist[index]==true)
		{
			finishlist[index]=false;
		}
		else{
			finishlist[index]=true;
		}
		update();
	}
}
//清除完成的事件
function clearfinish()
{
	var k=eventlist.length;
	for(var i=0;i<k;i++)
	{
		if(finishlist[i]==true)
		{
			eventlist.splice(i,1)
	        finishlist.splice(i,1)
			i--;k--;
		}	
	}
	update();
}
//全选或取消全选
function selectall()
{
	var flag=0;
	for(var i=0;i<finishlist.length;i++)
	{
		if(finishlist[i]==false)
		{flag=1;
	     break;
		}
	}
	if(flag==0)
	{
		for(var i=0;i<finishlist.length;i++)
		{
			finishlist[i]=false;
		}
	}
	else if(flag==1)
	{
		for(var i=0;i<finishlist.length;i++)
		{
			finishlist[i]=true;
		}
	}
	update();
}