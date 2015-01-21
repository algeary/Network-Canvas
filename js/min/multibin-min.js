var MultiBin=function o(e){var i={},t;i.options={targetEl:$(".container"),edgeType:"Dyad",variable:{label:"multibin_variable",values:["Variable 1"]},filter:void 0,heading:"Default Heading",subheading:"Default Subheading."};var n=!1;extend(i.options,e);var a=function(){i.destroy()},l=function(){var o=t,e={to:o};extend(e,i.options.criteria);var n=network.getEdges(e)[0],a={};$.each(i.options.followup.questions,function(o){var e=$("#"+i.options.followup.questions[o].variable).val();a[i.options.followup.questions[o].variable]=e}),extend(n,a),network.updateEdge(n.id,n),$.each(i.options.followup.questions,function(o){$("#"+i.options.followup.questions[o].variable).val("")}),$(".followup").hide()},s=function(){$("#"+i.options.followup.variable).val(""),$(".followup").hide()},d=function(o){o.stopPropagation(),o.target!==o.currentTarget&&n===!0&&($(".container").children().removeClass("invisible"),$(".copy").removeClass("node-bin-active"),$(".copy").addClass("node-bin-static"),$(".copy").children("h1, p").show(),$(".copy").removeClass("copy"),$(".draggable").draggable({cursor:"pointer",revert:"invalid",disabled:!1}),n=!1)},r=function(o){if(o.stopPropagation(),n===!1){if($(".draggable").draggable({cursor:"pointer",revert:"invalid",disabled:!0}),!$(this).hasClass(".node-bin-active")){$(".container").children().not(this).addClass("invisible");var e=$(this).offset(),i=$(this);i.offset(e),i.addClass("node-bin-active copy"),i.removeClass("node-bin-static"),i.children("h1, p").hide(),i.children(".active-node-list").children(".node-item").css({top:0,left:20,opacity:0}),setTimeout(function(){i.addClass("node-bin-active"),$.each($(".active-node-list").children(),function(o,e){setTimeout(function(){$(e).transition({left:0,opacity:1})},20*o)})},100)}n=!0}},p=function(o){o.stopPropagation();var e=$(this),t=$(this).parent().parent().data("index");if($(this).parent().hasClass("active-node-list")){var n=network.getEdges({from:network.getNodes({type_t0:"Ego"})[0].id,to:e.data("node-id"),type:i.options.edgeType})[0].id,a={};a[i.options.variable.label]="","undefined"!=typeof i.options.followup&&$.each(i.options.followup.questions,function(o,e){a[e.variable]=""}),network.updateEdge(n,a),$(this).fadeOut(400,function(){$(this).appendTo(".node-bucket"),$(this).css("display","");var o="people";1===$(".c"+t).children(".active-node-list").children().length&&(o="person"),$(".c"+t).children("p").html(0===$(".c"+t).children(".active-node-list").children().length?"(Empty)":$(".c"+t).children(".active-node-list").children().length+" "+o+".")})}};return i.destroy=function(){notify("Destroying multiBin.",0),window.removeEventListener("changeStageStart",a,!1),$(".node-bin-static").off("click",r),$(".node-item").off("click",p),$(".content").off("click",d),$(".followup-submit").off("click",l),$(".followup-cancel").off("click",s)},i.init=function(){if(i.options.targetEl.append("<h1>"+i.options.heading+"</h1>"),i.options.targetEl.append('<p class="lead">'+i.options.subheading+"</p>"),i.options.targetEl.append('<div class="node-bucket"></div>'),"undefined"!=typeof i.options.followup){if(i.options.targetEl.append('<div class="followup overlay"><form class="followup-form"></form></div>'),"undefined"!=typeof i.options.followup.linked&&i.options.followup.linked===!0){var o=!0;$.each(i.options.followup.questions,function(e){$(".followup").children("form").append("<h2>"+i.options.followup.questions[e].prompt+'</h2><div class="row form-group"><input type="number" class="form-control '+i.options.followup.questions[e].variable+'" id="'+i.options.followup.questions[e].variable+'" required></div>'),o&&$("#"+i.options.followup.questions[e].variable).change(function(){$("#"+i.options.followup.questions[e+1].variable).val()>$("#"+i.options.followup.questions[e].variable).val()&&$("#"+i.options.followup.questions[e+1].variable).val($("#"+i.options.followup.questions[e].variable).val()),$("#"+i.options.followup.questions[e+1].variable).attr("max",$("#"+i.options.followup.questions[e].variable).val())}),o=!o})}else $.each(i.options.followup.questions,function(o){$(".followup").children("form").append("<h2>"+i.options.followup.questions[o].prompt+'</h2><div class="row form-group"><input type="number" class="form-control '+i.options.followup.questions[o].variable+'" id="'+i.options.followup.questions[o].variable+'" required></div>')});$(".followup").children("form").append('<div class="row form-group"><button type="submit" class="btn btn-primary btn-block followup-submit">Continue</button></div>'),"undefined"!=typeof i.options.followup.cancel&&$(".overlay").children().last(".form-group").prepend('<button type="submit" class="btn btn-warning btn-block followup-cancel">'+i.options.followup.cancel+"</button>")}for(var e=Math.floor(.66*i.options.variable.values.length),n=$(".container").outerWidth()/e,c=n;2*c>$(".container").height()-300;)c=.98*c;var u=network.getEdges(i.options.criteria,i.options.filter);$.each(i.options.variable.values,function(o,e){var n=$('<div class="node-bin node-bin-static c'+o+'" data-index="'+o+'"><h1>'+e+'</h1><p class="lead">(Empty)</p><div class="active-node-list"></div></div>');n.data("index",o),i.options.targetEl.append(n),$(".c"+o).droppable({accept:".draggable",drop:function(e,n){var a=n.draggable,l=$(this);"undefined"!=typeof i.options.followup&&i.options.followup.trigger.indexOf(i.options.variable.values[o])>=0&&($(".followup").show(),$("#"+i.options.followup.questions[0].variable).focus(),t=$(a).data("node-id")),$(a).appendTo(l.children(".active-node-list"));var s={};s[i.options.variable.label]=i.options.variable.values[o];var d=network.getEdges({from:network.getNodes({type_t0:"Ego"})[0].id,to:$(a).data("node-id"),type:i.options.edgeType})[0].id;console.log(s),console.log(d),network.updateEdge(d,s);var r="people";1===$(".c"+o+" .active-node-list").children().length&&(r="person"),$(".c"+o+" p").html($(".c"+o+" .active-node-list").children().length+" "+r+".");var p=$(".c"+o);p.transition({scale:1.2},200,"ease"),setTimeout(function(){p.transition({background:p.data("oldBg")},200,"ease"),p.transition({scale:1},200,"ease")},0)},over:function(){$(this).data("oldBg",$(this).css("background-color")),$(this).stop().transition({background:"rgba(255, 193, 0, 1.0)"},400,"ease")},out:function(){$(this).stop().transition({background:$(this).data("oldBg")},500,"ease")}})}),$(".node-bin").css({width:c-20,height:c-20}),$(".node-bin h1").css({marginTop:c/3}),$.each($(".node-bin"),function(o,e){var i=$(e).offset();$(e).data("oldPos",i),$(e).css(i)}),$(".node-bin").css({position:"absolute"}),$.each(u,function(o,e){var t=network.getEdges({from:network.getNodes({type_t0:"Ego"})[0].id,type:"Dyad",to:e.to})[0];if(void 0!==e[i.options.variable.label]&&""!==e[i.options.variable.label]){o=i.options.variable.values.indexOf(e[i.options.variable.label]),$(".c"+o).children(".active-node-list").append('<div class="node-item draggable" data-node-id="'+e.to+'">'+t.nname_t0+"</div>");var n="people";1===$(".c"+o).children(".active-node-list").children().length&&(n="person"),$(".c"+o).children("p").html(0===$(".c"+o).children(".active-node-list").children().length?"(Empty)":$(".c"+o).children(".active-node-list").children().length+" "+n+".")}else $(".node-bucket").append('<div class="node-item draggable" data-node-id="'+e.to+'">'+t.nname_t0+"</div>")}),$(".draggable").draggable({cursor:"pointer",revert:"invalid",disabled:!1}),window.addEventListener("changeStageStart",a,!1),$(".node-bin-static").on("click",r),$(".node-item").on("click",p),$(".content").on("click",d),$(".followup-form").on("submit",l),$(".followup-cancel").on("click",s)},i.init(),i};