import std.collection.*

func calcularTotal(ventas: ArrayList<Int64>): Int64 {
    var total: Int64 = 0

    for (venta in ventas) {
        total += venta
    }

    return total
}

func contarVentasAltas(
    ventas: ArrayList<Int64>,
    minimo: Int64
): Int64 {
    var cantidad: Int64 = 0

    for (venta in ventas) {
        if (venta >= minimo) {
            cantidad++
        }
    }

    return cantidad
}

func aplicarIncremento(venta: Int64): Int64 {
    return venta + 10
}

func transformarVentas(
    ventas: ArrayList<Int64>,
    operacion: (Int64) -> Int64
): ArrayList<Int64> {
    let resultado = ArrayList<Int64>()

    for (venta in ventas) {
        resultado.add(operacion(venta))
    }

    return resultado
}

main() {
    println("=== ANALISIS FUNCIONAL DE VENTAS ===")

    let ventas = ArrayList<Int64>([120, 80, 150, 60])

    println("")
    println("Ventas originales:")
    println(ventas)

    let total = calcularTotal(ventas)
    println("Total de ventas: ${total}")

    let cantidad = contarVentasAltas(ventas, 100)
    println("Ventas de 100 o mas: ${cantidad}")

    let nuevasVentas = transformarVentas(
        ventas,
        aplicarIncremento
    )

    println("")
    println("Ventas con incremento de 10:")
    println(nuevasVentas)

    let nuevoTotal = calcularTotal(nuevasVentas)
    println("Nuevo total: ${nuevoTotal}")

    println("")
    println("Analisis finalizado.")
}
