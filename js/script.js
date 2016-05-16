$(document).ready(function(){
	$("#errorAlert").hide();
	clear();
	load(); // Lista a los alumnos al cargar la página

	// Nuevo alumno
	$("#addModal").click(function(){
		clear();
		$("#errorAlert").hide();
		if($("#cancelar").next().attr("id")==="mod"){
			$("#mod").remove();
			$("#cancelar").after("<button type='button' class='btn btn-primary' id='add'>Agregar</button>");
			$("#modalLabel").text("Nuevo alumno");
		}

		$("#nuevoAlumno").modal('show'); // Muestra el formulario para agregar
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
					$("html, body").animate({
							scrollTop: $("#alumnos").children().last().offset().top},200);
					$("#alumnos").children().last().fadeTo(800, 0.5, function(){
						$("#alumnos").children().last().fadeTo(800, 1);
					});
				},
				error: function(result, status, xhr){
					$("#errorAlert").show();
				}
			});
		});
	});

	// Buscar
	$("#btnSearch").click(function(){
		var id = $("#search").val();
		if(id!=""){
			$.ajax({
				url: "https://andreihelo-restful-api.herokuapp.com/students/"+id,
				success: function(result, status, xhr){
					$("#alumnos").children().remove();
					$("#alumnos").append("<tr><td>"+result.id+"</td><td>"
							+result.registration_number
							+"</td><td>"+result.name+"</td><td>"+result.last_name
							+"</td><td>"+result.status
							+"</td><td><button class='btn btn-success'><span class='glyphicon glyphicon-pencil'"
							+" aria-hiden='true'></span></button><button class='btn btn-danger'>"
							+"<span class='glyphicon glyphicon-remove-sign' "
							+"aria-hiden='true'></span></button></td></tr>");
					if(($(".col-lg-4").next().attr("id"))!=="clearSearch"){
						$(".row").append("<button class='btn btn-default' id='clearSearch'>Mostrar todos</button>");
					}
				},
				error: function(){
					$("#alumnos").children().remove();
					$("#alumnos").append("<tr><td colspan='6'>No se encontró ningún registro</td></tr>");
					if(($(".col-lg-4").next().attr("id"))!=="clearSearch")
						$(".row").append("<button class='btn btn-default' id='clearSearch'>Mostrar todos</button>");
				}
			});
		}
	});
	
	// Mostrar todos después de la búsqueda
	$(document).on("click","#clearSearch",function(){
		$("#alumnos").children().remove();
		$(this).remove();
		$("#search").val("");
		load();
	});

	// Modificar
	$(document).on("click",".btn-success",function(){
		clear();
		$("#errorAlert").hide();
		var row = $(this).parent().parent();
		var id = row.children().eq(0).text();
		console.log(id);
		$("#registration_number").val(row.children().eq(1).text());
		$("#name").val(row.children().eq(2).text());
		$("#last_name").val(row.children().eq(3).text());
		$("#status").val(row.children().eq(4).text());

		$("#nuevoAlumno").modal('show');
		$("#modalLabel").text("Modificar alumno");
		if($("#cancelar").next().attr("id")==="add"){
			$("#add").remove();
			$("#cancelar").after("<button type='button' class='btn btn-primary' id='mod'>Modficar</button>");
		}

		$("#mod").click(function(){
			if($("#registration_number").val()!="")
				var registration_number = $("#registration_number").val();
			if($("#name").val()!="")
				var name = $("#name").val();
			if($("#last_name").val()!="")
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
					row.fadeTo(800, 0.5, function(){
						row.fadeTo(800, 1);
					});
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

	// Eliminar
	$(document).on("click",".btn-danger",function(){
		var row = $(this).parent().parent().children();
		var id = row.eq(0).text();
		console.log(id);
		$.ajax({
			url: "https://andreihelo-restful-api.herokuapp.com/students/"+id,
			method: "POST",
			data: {
				"_method" : "DELETE"
			},
			success: function(result, status, xhr){
				row.remove();
			}
		});
	});

	// Listar estudiantes
	function load(){
		$.ajax({
			url: "https://andreihelo-restful-api.herokuapp.com/students",
			success: function(result, status, xhr){
				$.each(result, function(i){
					$("#alumnos").append("<tr><td>"+result[i].id+"</td>"
						+"<td>"+result[i].registration_number+"</td>"
						+"<td>"+result[i].name+"</td>"
						+"<td>"+result[i].last_name+"</td>"
						+"<td>"+result[i].status+"</td>"
						+"<td><button class='btn btn-success'>"
						+"<span class='glyphicon glyphicon-pencil'"
						+" aria-hiden='true'></span></button><button class='btn btn-danger'>"
						+"<span class='glyphicon glyphicon-remove-sign' "
						+"aria-hiden='true'></span></button></td></tr>");
				});
			}
		});
	}

	// Limpia los campos del formulario agregar/modificar
	function clear(){
		$("#registration_number").val("");
		$("#name").val("");
		$("#last_name").val("");
		$("#status").val("");
	}
});