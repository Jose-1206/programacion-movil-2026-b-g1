import std.collection.*
import std.env.*
import std.convert.*

let registros = ArrayList<(Int64, String)>()

func agregarRegistro() {
    print("Ingrese el ID de la maquina: ")
    let entrada = getStdIn().readln() ?? ""

    try {
        let id = Int64.parse(entrada)

        if (id < 1001 || id > 1100) {
            println("Error: ID fuera del rango permitido.")
            return
        }

        println("1. Falla")
        println("2. Mantenimiento")
        print("Seleccione el tipo de registro: ")
        let tipo = getStdIn().readln() ?? ""

        if (tipo == "1") {
            registros.add((id, "Falla"))
            println("Falla registrada correctamente.")
        } else if (tipo == "2") {
            registros.add((id, "Mantenimiento"))
            println("Mantenimiento registrado correctamente.")
        } else {
            println("Opcion no valida.")
        }
    } catch (e: Exception) {
        println("Error: debe ingresar un ID numerico.")
    }
}

func mostrarRegistros() {
    println("=== REGISTROS DE OPERACION ===")
    println("Total de registros: ${registros.size}")

    for (registro in registros) {
        println("Maquina: ${registro[0]}, Tipo: ${registro[1]}")
    }
}

func mostrarEstadisticas() {
    var fallas = 0
    var mantenimientos = 0

    for (registro in registros) {
        if (registro[1] == "Falla") {
            fallas++
        } else if (registro[1] == "Mantenimiento") {
            mantenimientos++
        }
    }

    println("=== ESTADISTICAS ===")
    println("Total de fallas: ${fallas}")
    println("Total de mantenimientos: ${mantenimientos}")
    println("Total de eventos: ${registros.size}")
}

func consultarMaquina() {
    print("Ingrese el ID de la maquina: ")
    let entrada = getStdIn().readln() ?? ""

    try {
        let id = Int64.parse(entrada)
        var encontrados = 0

        println("=== HISTORIAL DE LA MAQUINA ===")

        for (registro in registros) {
            if (registro[0] == id) {
                println("ID: ${registro[0]}, Tipo: ${registro[1]}")
                encontrados++
            }
        }

        println("Registros encontrados: ${encontrados}")
    } catch (e: Exception) {
        println("Error: ID no valido.")
    }
}

main() {
    println("=== ANALISIS DE OPERACION Y MANTENIMIENTO ===")

    while (true) {
        println("")
        println("1. Registrar falla o mantenimiento")
        println("2. Mostrar todos los registros")
        println("3. Ver estadisticas")
        println("4. Consultar historial de una maquina")
        println("5. Salir")
        print("Seleccione una opcion: ")

        let opcion = getStdIn().readln() ?? ""

        match (opcion) {
            case "1" => agregarRegistro()
            case "2" => mostrarRegistros()
            case "3" => mostrarEstadisticas()
            case "4" => consultarMaquina()
            case "5" => break
            case _ => println("Opcion no valida")
        }
    }

    println("Programa finalizado.")
}
