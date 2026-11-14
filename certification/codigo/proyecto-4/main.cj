import std.collection.*
import std.env.*

let habitaciones = ArrayList<String>(["Sala", "Habitacion"])
let dispositivos = ArrayList<(String, String, String, Bool)>()

// Cada dispositivo guarda: (nombre, tipo, habitacion, encendido)

func existeHabitacion(nombre: String): Bool {
    for (habitacion in habitaciones) {
        if (habitacion == nombre) {
            return true
        }
    }
    return false
}

func buscarDispositivo(nombre: String): Int64 {
    var i: Int64 = 0
    while (i < dispositivos.size) {
        if (dispositivos[i][0] == nombre) {
            return i
        }
        i++
    }
    return -1
}

func mostrarDispositivos() {
    println("")
    println("=== LISTA DE DISPOSITIVOS ===")
    println("Total: ${dispositivos.size}")

    for (d in dispositivos) {
        println("Nombre: ${d[0]}")
        println("Tipo: ${d[1]}")
        println("Habitacion: ${d[2]}")
        if (d[3]) {
            println("Estado: Activado")
        } else {
            println("Estado: Desactivado")
        }
        println("-------------------")
    }
}

func agregarDispositivo() {
    print("Nombre del dispositivo: ")
    let nombre = getStdIn().readln() ?? ""

    if (nombre == "" || buscarDispositivo(nombre) >= 0) {
        println("Error: nombre vacio o repetido.")
        return
    }

    println("=== TIPOS DE DISPOSITIVOS ===")
    println("1. Sensor de temperatura")
    println("2. Sensor de humedad")
    println("3. Purificador de aire")
    println("4. Bascula corporal")
    println("5. Cortina inteligente")
    println("6. Iluminacion inteligente")
    print("Seleccione el tipo: ")

    let opcion = getStdIn().readln() ?? ""
    var tipo = ""

    if (opcion == "1") {
        tipo = "Sensor de temperatura"
    } else if (opcion == "2") {
        tipo = "Sensor de humedad"
    } else if (opcion == "3") {
        tipo = "Purificador de aire"
    } else if (opcion == "4") {
        tipo = "Bascula corporal"
    } else if (opcion == "5") {
        tipo = "Cortina inteligente"
    } else if (opcion == "6") {
        tipo = "Iluminacion inteligente"
    } else {
        println("Tipo no valido.")
        return
    }

    println("Habitaciones disponibles:")
    println(habitaciones)
    print("Ingrese la habitacion: ")

    let habitacion = getStdIn().readln() ?? ""

    if (!existeHabitacion(habitacion)) {
        println("Error: la habitacion no existe.")
        return
    }

    dispositivos.add((nombre, tipo, habitacion, false))
    println("Dispositivo agregado correctamente.")
}

func eliminarDispositivo() {
    print("Nombre del dispositivo a eliminar: ")
    let nombre = getStdIn().readln() ?? ""

    let i = buscarDispositivo(nombre)

    if (i < 0) {
        println("Dispositivo no encontrado.")
        return
    }

    dispositivos.remove(at: i)
    println("Dispositivo eliminado correctamente.")
}

func moverDispositivo() {
    print("Nombre del dispositivo a mover: ")
    let nombre = getStdIn().readln() ?? ""

    let i = buscarDispositivo(nombre)

    if (i < 0) {
        println("Dispositivo no encontrado.")
        return
    }

    println("Habitaciones disponibles:")
    println(habitaciones)
    print("Nueva habitacion: ")

    let nueva = getStdIn().readln() ?? ""

    if (!existeHabitacion(nueva)) {
        println("Habitacion no valida.")
        return
    }

    let d = dispositivos[i]
    dispositivos[i] = (d[0], d[1], nueva, d[3])
    println("Dispositivo movido correctamente.")
}

func controlarDispositivo() {
    print("Nombre del dispositivo a controlar: ")
    let nombre = getStdIn().readln() ?? ""

    let i = buscarDispositivo(nombre)

    if (i < 0) {
        println("Dispositivo no encontrado.")
        return
    }

    let d = dispositivos[i]

    println("Dispositivo: ${d[0]}")
    println("Tipo: ${d[1]}")

    if (d[3]) {
        println("Estado actual: Activado")
    } else {
        println("Estado actual: Desactivado")
    }

    println("1. Activar")
    println("2. Desactivar")
    print("Seleccione una opcion: ")

    let opcion = getStdIn().readln() ?? ""

    if (opcion == "1") {
        dispositivos[i] = (d[0], d[1], d[2], true)
        println("Dispositivo activado.")
    } else if (opcion == "2") {
        dispositivos[i] = (d[0], d[1], d[2], false)
        println("Dispositivo desactivado.")
    } else {
        println("Opcion no valida.")
    }
}

func mostrarHabitaciones() {
    println("")
    println("=== LISTA DE HABITACIONES ===")
    for (habitacion in habitaciones) {
        println("Habitacion: ${habitacion}")
    }
}

func agregarHabitacion() {
    print("Nombre de la nueva habitacion: ")
    let nombre = getStdIn().readln() ?? ""

    if (nombre == "" || existeHabitacion(nombre)) {
        println("Error: habitacion vacia o repetida.")
        return
    }

    habitaciones.add(nombre)
    println("Habitacion agregada correctamente.")
}

func eliminarHabitacion() {
    print("Habitacion a eliminar: ")
    let nombre = getStdIn().readln() ?? ""

    var i: Int64 = 0

    while (i < habitaciones.size) {
        if (habitaciones[i] == nombre) {
            for (d in dispositivos) {
                if (d[2] == nombre) {
                    println("Error: primero mueva o elimine sus dispositivos.")
                    return
                }
            }

            habitaciones.remove(at: i)
            println("Habitacion eliminada.")
            return
        }
        i++
    }

    println("Habitacion no encontrada.")
}

func verDispositivosHabitacion() {
    print("Ingrese la habitacion: ")
    let nombre = getStdIn().readln() ?? ""

    if (!existeHabitacion(nombre)) {
        println("Habitacion no encontrada.")
        return
    }

    var cantidad: Int64 = 0

    println("=== DISPOSITIVOS DE ${nombre} ===")

    for (d in dispositivos) {
        if (d[2] == nombre) {
            println("${d[0]} - ${d[1]}")
            cantidad++
        }
    }

    println("Total: ${cantidad}")
}

func controlarEnHabitacion() {
    print("Ingrese la habitacion: ")
    let habitacion = getStdIn().readln() ?? ""

    if (!existeHabitacion(habitacion)) {
        println("Habitacion no encontrada.")
        return
    }

    print("Nombre del dispositivo: ")
    let nombre = getStdIn().readln() ?? ""
    let i = buscarDispositivo(nombre)

    if (i < 0) {
        println("Dispositivo no encontrado.")
        return
    }

    if (dispositivos[i][2] != habitacion) {
        println("El dispositivo no pertenece a esa habitacion.")
        return
    }

    let d = dispositivos[i]

    print("1. Activar / 2. Desactivar: ")
    let opcion = getStdIn().readln() ?? ""

    if (opcion == "1") {
        dispositivos[i] = (d[0], d[1], d[2], true)
        println("Dispositivo activado.")
    } else if (opcion == "2") {
        dispositivos[i] = (d[0], d[1], d[2], false)
        println("Dispositivo desactivado.")
    } else {
        println("Opcion no valida.")
    }
}

func menuDispositivos() {
    while (true) {
        println("")
        println("=== MENU DE DISPOSITIVOS ===")
        println("1. Mostrar dispositivos")
        println("2. Agregar dispositivo")
        println("3. Eliminar dispositivo")
        println("4. Mover dispositivo")
        println("5. Controlar dispositivo")
        println("6. Volver")
        print("Opcion: ")

        let opcion = getStdIn().readln() ?? ""

        match (opcion) {
            case "1" => mostrarDispositivos()
            case "2" => agregarDispositivo()
            case "3" => eliminarDispositivo()
            case "4" => moverDispositivo()
            case "5" => controlarDispositivo()
            case "6" => break
            case _ => println("Opcion no valida.")
        }
    }
}

func menuHabitaciones() {
    while (true) {
        println("")
        println("=== MENU DE HABITACIONES ===")
        println("1. Mostrar habitaciones")
        println("2. Agregar habitacion")
        println("3. Eliminar habitacion")
        println("4. Ver dispositivos de habitacion")
        println("5. Controlar dispositivo de habitacion")
        println("6. Volver")
        print("Opcion: ")

        let opcion = getStdIn().readln() ?? ""

        match (opcion) {
            case "1" => mostrarHabitaciones()
            case "2" => agregarHabitacion()
            case "3" => eliminarHabitacion()
            case "4" => verDispositivosHabitacion()
            case "5" => controlarEnHabitacion()
            case "6" => break
            case _ => println("Opcion no valida.")
        }
    }
}

main() {
    println("=== SISTEMA DE HOGAR INTELIGENTE ===")

    while (true) {
        println("")
        println("1. Administrar dispositivos")
        println("2. Administrar habitaciones")
        println("3. Salir")
        print("Seleccione una opcion: ")

        let opcion = getStdIn().readln() ?? ""

        match (opcion) {
            case "1" => menuDispositivos()
            case "2" => menuHabitaciones()
            case "3" => break
            case _ => println("Opcion no valida.")
        }
    }

    println("Programa finalizado.")
}
