var x=0;

function setCookie(c_name, value, expiredays) {
    var exdate = new Date();
    exdate.setDate(exdate.getDate() + 365);
    document.cookie = c_name + "=" + escape(value) + ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString());
}

function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=");
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1;
            c_end = document.cookie.indexOf(";", c_start);
            if (c_end == -1)
                c_end = document.cookie.length;
            var str = unescape(document.cookie.substring(c_start, c_end));
            //alert(str);
            setCookie(c_name, str, 365);
            return str;
        }
    }
    return "";
}

function Pair() {   
    var tmp=0;
    var inmemnum = 0
    var result = [-1,-1,-1,-1,-1,-1];
    var people = ["玉霞","Jennifer","玉娟","冠緯","玉貞","艾莎"];
    var result2 = [-1,-1,-1,-1,-1,-1];

    if(document.getElementById("chk_one").checked)
    {
        result[inmemnum] = 0;
        inmemnum++;
    }    
    if(document.getElementById("chk_two").checked)
    {
        result[inmemnum] = 1; 
        inmemnum++;
    }                                        
    if(document.getElementById("chk_three").checked)
    {
        result[inmemnum] = 2;  
        inmemnum++;
    } 
    if(document.getElementById("chk_four").checked)
    {
        result[inmemnum] = 3;   
        inmemnum++;
    } 
    if(document.getElementById("chk_five").checked)
    {
        result[inmemnum] = 4;   
        inmemnum++;
    } 
    if(document.getElementById("chk_six").checked)
    {
        result[inmemnum] = 5;   
        inmemnum++;
    }

  for (let i = result.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }

  for(var i =0; i<6; i++)
  {
    if(result[i] != -1)
    {
        result2[tmp] = result[i];
        tmp++;
    }    
  }
    //alert("inmemnum = " + inmemnum + ",  ---0:"  + result[0]+"---1:"+result[1]+"---2:"+result[2]+"---3:"+result[3]+"---4:"+result[4]+"---5:"+result[5]); 


    var tableData="";
     
    if(inmemnum == 0)
    {
        tableData += "<tr>";
        tableData += "<th>1</th>";
        //tableData += '<td>'+GetStr(language, "Remove Black Edges")+'</td>';
        tableData += '<td>沒有人喔</td>';
        tableData += "</tr>";
                          
    }
    else if(inmemnum == 1)
    {
        tableData += "<tr>";
        tableData += "<th>1</th>";
        //tableData += '<td>'+GetStr(language, "Remove Black Edges")+'</td>';
        tableData += '<td>'+ people[result2[0]]+'</td>';
        tableData += "</tr>";                         
    }
    else if(inmemnum == 2)
    {
        tableData += "<tr>";
        tableData += "<th>1</th>";
        //tableData += '<td>'+GetStr(language, "Remove Black Edges")+'</td>';
        tableData += '<td>'+ people[result2[0]]+' '+ people[result2[1]]+ ' 互做'+'</td>';
        tableData += "</tr>";                       
    }
    else if(inmemnum == 3)
    {
        tableData += "<tr>";
        tableData += "<th>1</th>";       
        tableData += '<td style="word-wrap:break-word;">'+ people[result2[0]]+' 幫 '+ people[result2[1]]+'</td>';
        tableData += '<td style="word-wrap:break-word;">'+ people[result2[1]]+' 幫 '+ people[result2[2]]+'</td>';
        tableData += '<td style="word-wrap:break-word;">'+ people[result2[2]]+' 幫 '+ people[result2[0]]+'</td>';    
        tableData += "</tr>";                      
    }
    else if(inmemnum == 4)
    {
        tableData += "<tr>";
        tableData += "<th>1</th>";
        tableData += '<td>'+ people[result2[0]]+' '+ people[result2[1]]+ ' 互做'+'</td>';
        tableData += "</tr>";

        tableData += "<tr>";
        tableData += "<th>2</th>";
        tableData += '<td>'+ people[result2[2]]+' '+ people[result2[3]]+ ' 互做'+'</td>';
        tableData += "</tr>";
    } 
    else if(inmemnum == 5)
    {
        tableData += "<tr>";
        tableData += "<th>1</th>";
        tableData += '<td style="word-wrap:break-word;">'+ people[result2[0]]+' 幫 '+ people[result2[1]]+'</td>';
        tableData += '<td style="word-wrap:break-word;">'+ people[result2[1]]+' 幫 '+ people[result2[2]]+'</td>';
        tableData += '<td style="word-wrap:break-word;">'+ people[result2[2]]+' 幫 '+ people[result2[0]]+'</td>';
        tableData += "</tr>";

        tableData += "<tr>";
        tableData += "<th>2</th>";
        tableData += '<td>'+ people[result2[3]]+' '+ people[result2[4]]+ ' 互做'+'</td>';
        tableData += "</tr>";     
    }       
    else if(inmemnum == 6)
    {
        tableData += "<tr>";
        tableData += "<th>1</th>";
        tableData += '<td>'+ people[result2[0]]+' '+ people[result2[1]]+ ' 互做'+'</td>';
        tableData += "</tr>";

        tableData += "<tr>";
        tableData += "<th>2</th>";
        tableData += '<td>'+ people[result2[2]]+' '+ people[result2[3]]+ ' 互做'+'</td>';
        tableData += "</tr>";

        tableData += "<tr>";
        tableData += "<th>3</th>";
        tableData += '<td>'+ people[result2[4]]+' '+ people[result2[5]]+ ' 互做'+'</td>';
        tableData += "</tr>";
    }
    
    $("#tbody1").html(tableData)
    x=x +1;
    document.getElementById('dianjicishu').innerHTML = x;                
}

































