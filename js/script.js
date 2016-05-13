$(document).ready(function(){
	var i =0;
	$("#errorAlert").hide();
	clear();
	load();

	$("#addModal").click(function(){
		clear();
		$("#errorAlert").hide();
		if($("#cancelar").next().attr("id")==="mod"){
			$("#mod").remove();
			$("#cancelar").after("<button type='button' class='btn btn-primary' id='add'>Agregar</button>");
			$("#modalLabel").text("Nuevo alumno");
		}

		$("#nuevoAlumno").modal('show');
		$("#add").click(function(){

			var registration_number = $("#registration_number").val();
			var name = $("#name").val();
			var last_name = $("#last_name").val();
			var status = $("#status").val();
			var student = {
				"registration_number" : registration_number,
				"name" : name,
				"last_name" : last_name,
				"status" : status
			};

			$.ajax({
				url: "https://andreihelo-restful-api.herokuapp.com/students",
				method: "POST",
				data: student,
				success: function(result, status, xhr){
					$("#alumnos").append("<tr><td>"+result.id+"</td><td>"
						+result.registration_number
						+"</td><td>"+result.name+"</td><td>"+result.last_name
						+"</td><td>"+result.status
						+"</td><td><button class='btn btn-success'><span class='glyphicon glyphicon-pencil'"
						+" aria-hiden='true'></span></button><button class='btn btn-danger'>"
						+"<span class='glyphicon glyphicon-remove-sign' "
						+"aria-hiden='true'></span></button></td></tr>");
						$("#nuevoAlumno").modal('hide');
				},
				error: function(result, status, xhr){
					$("#errorAlert").show();
				}
			});
		});
	});

	$("#btnSearch").click(function(){
		var id = $("#search").val();
		if(id!=""){
			$.ajax({
				url: "https://andreihelo-restful-api.herokuapp.com/students/"+id,
				success: function(result, status, xhr){
					$("#alumnos").find("tr").eq(0).nextAll().remove();
					$("#alumnos").append("<tr><td>"+result.id+"</td><td>"
							+result.registration_number
							+"</td><td>"+result.name+"</td><td>"+result.last_name
							+"</td><td>"+result.status
							+"</td><td><button class='btn btn-success'><span class='glyphicon glyphicon-pencil'"
							+" aria-hiden='true'></span></button><button class='btn btn-danger'>"
							+"<span class='glyphicon glyphicon-remove-sign' "
							+"aria-hiden='true'></span></button></td></tr>");
					if(($("#btnSearch").next().attr("id"))!=="clearSearch")
						$("header").append("<button class='btn btn-default' id='clearSearch'>Mostrar todos</button>");
				},
				error: function(){
					$("#alumnos").find("tr").eq(0).nextAll().remove();
					$("#alumnos").append("<tr><td colspan='6'>No se encontró ningún registro</td></tr>");
					$("header").append("<button class='btn btn-default' id='clearSearch'>Mostrar todos</button>");
				}
			});
		}
	});

	$(document).on("click","#clearSearch",function(){
		$("#alumnos").find("tr").eq(0).nextAll().remove();
		$(this).remove();
		$("#search").val("");
		load();
	});

	$(document).on("click",".btn-success",function(){
		clear();
		$("#errorAlert").hide();
		var row = $(this).parent().parent();
		var id = row.children().eq(0).text();
		console.log(row.html()+" id: "+id);
		$("#nuevoAlumno").modal('show');
		$("#modalLabel").text("Modificar alumno");
		if($("#cancelar").next().attr("id")==="add"){
			$("#add").remove();
			$("#cancelar").after("<button type='button' class='btn btn-primary' id='mod'>Modficar</button>");
		}

		$("#mod").click(function(){
			var registration_number = $("#registration_number").val();
			var name = $("#name").val();
			var last_name = $("#last_name").val();
			var status = $("#status").val();

			var student = {
				"registration_number" : registration_number,
				"name" : name,
				"last_name" : last_name,
				"status" : status
			};

			$.ajax({
				url: "https://andreihelo-restful-api.herokuapp.com/students/"+id+"?_method=PUT",
				method: "POST",
				data: student,
				success: function(result, status, xhr){
					row.empty();
					row.html("<td>"+result.id+"</td><td>"
						+result.registration_number
						+"</td><td>"+result.name+"</td><td>"+result.last_name
						+"</td><td>"+result.status
						+"</td><td><button class='btn btn-success'><span class='glyphicon glyphicon-pencil'"
						+" aria-hiden='true'></span></button><button class='btn btn-danger'>"
						+"<span class='glyphicon glyphicon-remove-sign' "
						+"aria-hiden='true'></span></button></td>");
					$("#nuevoAlumno").modal('hide');
				},
				error: function(result, status, xhr){
					$("#errorAlert").show();
				}
			});
		});
	});

	$(document).on("click",".btn-danger",function(){
		var row = $(this).parent().parent().children();
		var id = row.eq(0).text();
		console.log(id);
		$.ajax({
			url: "http://andreihelo-restful-api.herokuapp.com/students/"+id,
			method: "POST",
			data: {
				"_method" : "DELETE"
			},
			success: function(result, status, xhr){
				row.remove();
			}
		});
	});

	function load(){
		$.ajax({
			url: "https://andreihelo-restful-api.herokuapp.com/students",
			success: function(result, status, xhr){
				$.each(result, function(i){
					$("#alumnos").append("<tr><td>"+result[i].id+"</td><td>"
						+result[i].registration_number
						+"</td><td>"+result[i].name+"</td><td>"+result[i].last_name
						+"</td><td>"+result[i].status
						+"</td><td><button class='btn btn-success'>"
						+"<span class='glyphicon glyphicon-pencil'"
						+" aria-hiden='true'></span></button><button class='btn btn-danger'>"
						+"<span class='glyphicon glyphicon-remove-sign' "
						+"aria-hiden='true'></span></button></td></tr>");
				});
			}
		});
	}

	function clear(){
		$("#registration_number").val("");
		$("#name").val("");
		$("#last_name").val("");
		$("#status").val("");
	}
});