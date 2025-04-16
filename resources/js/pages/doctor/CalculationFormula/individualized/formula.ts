import { safeDivide } from '@/lib/utils'

export function calculateEstimateElectrolyte(B8: number, F53: number, C53: number, C93: number, C96: number) {

    return B8 == 0 ? 0 : ((F53 - C53) / B8) + (C93 / B8) + ((C96 * 3.89) / B8) - (1.25 * B8);
}


export function getCairanNote(B6: number, B7: number, B13: number, C13: number) {
    if (Number(C13) === 0) {
        return "Tidak ada cairan yang diberikan, evaluasi kembali kebutuhan cairan pasien";
    }

    const kurang = [
        B7 >= 23 && B7 <= 27 && B6 === 0 && B13 < 80,
        B7 >= 23 && B7 <= 27 && B6 === 1 && B13 < 100,
        B7 >= 23 && B7 <= 27 && B6 === 2 && B13 < 120,
        B7 >= 23 && B7 <= 27 && B6 === 3 && B13 < 140,
        B7 >= 23 && B7 <= 27 && B6 >= 4 && B13 < 150,

        B7 >= 28 && B7 <= 32 && B6 === 0 && B13 < 60,
        B7 >= 28 && B7 <= 32 && B6 === 1 && B13 < 80,
        B7 >= 28 && B7 <= 32 && B6 === 2 && B13 < 100,
        B7 >= 28 && B7 <= 32 && B6 === 3 && B13 < 120,
        B7 >= 28 && B7 <= 32 && B6 === 4 && B13 < 140,
        B7 >= 28 && B7 <= 32 && B6 >= 5 && B13 < 150,

        B7 >= 33 && B7 <= 36 && B6 === 0 && B13 < 60,
        B7 >= 33 && B7 <= 36 && B6 === 1 && B13 < 80,
        B7 >= 33 && B7 <= 36 && B6 === 2 && B13 < 100,
        B7 >= 33 && B7 <= 36 && B6 === 3 && B13 < 120,
        B7 >= 33 && B7 <= 36 && B6 === 4 && B13 < 140,
        B7 >= 33 && B7 <= 36 && B6 >= 5 && B13 < 150,
    ];

    if (kurang.some(Boolean)) {
        return "Total cairan yang diberikan lebih rendah dari kebutuhan cairan sesuai usia gestasi dan usia aktual, namun tetap pertimbangkan kondisi klinis, balans dan diuresis pasien";
    }

    const lebih = [
        B7 >= 23 && B7 <= 27 && B6 === 0 && B13 > 80,
        B7 >= 23 && B7 <= 27 && B6 === 1 && B13 > 100,
        B7 >= 23 && B7 <= 27 && B6 === 2 && B13 > 120,
        B7 >= 23 && B7 <= 27 && B6 === 3 && B13 > 140,
        B7 >= 23 && B7 <= 27 && B6 >= 4 && B13 > 150,

        B7 >= 28 && B7 <= 32 && B6 === 0 && B13 > 80,
        B7 >= 28 && B7 <= 32 && B6 === 1 && B13 > 100,
        B7 >= 28 && B7 <= 32 && B6 === 2 && B13 > 120,
        B7 >= 28 && B7 <= 32 && B6 === 3 && B13 > 140,
        B7 >= 28 && B7 <= 32 && B6 >= 4 && B13 > 150,

        B7 >= 33 && B7 <= 36 && B6 === 0 && B13 > 80,
        B7 >= 33 && B7 <= 36 && B6 === 1 && B13 > 100,
        B7 >= 33 && B7 <= 36 && B6 === 2 && B13 > 120,
        B7 >= 33 && B7 <= 36 && B6 === 3 && B13 > 140,
        B7 >= 33 && B7 <= 36 && B6 >= 4 && B13 > 150,
    ];

    if (lebih.some(Boolean)) {
        return "Total cairan yang diberikan lebih tinggi dari kebutuhan cairan sesuai usia gestasi dan usia aktual, namun tetap pertimbangkan kondisi klinis,balans dan diuresis pasien";
    }

    return "Total cairan yang diberikan telah sesuai dengan kebutuhan harian untuk usia gestasi dan usia aktual pasien, namun tetap pertimbangkan klinis, balans dan diuresis pasien";
}


export function kaliumWarning(B8: number, B115: number, kalium: number) {
    const totalKalium = kalium + B115;

    if (kalium === 0) {
        if ((B8 < 1.5 && B115 > 5) || (B8 >= 1.5 && B115 > 3)) {
            return "Baseline kalium serum tidak diketahui, dosis harian kalium melebihi rentang dosis harian untuk berat badan aktual, pertimbangkan risiko hiperkalemia, namun tetap pertimbangkan klinis, balans dan diuresis pasien";
        } else {
            return "Baseline kalium serum tidak diketahui, dosis harian kalium dalam batas rekomendasi harian, namun tetap pertimbangkan klinis, balans dan diuresis pasien";
        }
    } else {
        if ((B8 < 1.5 && B115 > 5) || (B8 >= 1.5 && B115 > 3)) {
            let result = "Dosis harian kalium melebihi rentang dosis kalium untuk berat badan aktual, saran turunkan dosis kalium, ";
            if (totalKalium > 5.5) {
                result += "kadar kalium serum pasca pemberian KCl diestimasi > 5,5, pertimbangkan risiko hiperkalemia";
            } else if (totalKalium < 3.5) {
                result += "kadar kalium serum pasca pemberian KCl diestimasi masih < 3,5, saran atur ulang dosis bila belum melebihi batas maksimal";
            } else {
                result += "kadar kalium serum pasca pemberian KCl diestimasi berada di rentang normal";
            }
            return result + ", namun tetap pertimbangkan klinis, balans dan diuresis pasien";
        } else {
            let result = "Dosis harian kalium dalam batas rekomendasi, ";
            if (totalKalium > 5.5) {
                result += "kadar kalium serum pasca pemberian KCl diestimasi > 5,5, saran turunkan dosis kalium";
            } else if (totalKalium < 3.5) {
                result += "kadar kalium serum pasca pemberian KCl diestimasi < 3,5, saran naikkan dosis sesuai kebutuhan dan batas maksimal harian";
            } else {
                result += "kadar kalium serum pasca pemberian KCl diestimasi berada di rentang normal";
            }
            return result + ", namun tetap pertimbangkan klinis, balans dan diuresis pasien";
        }
    }
}


export function evaluateNatrium(natriumAwal: number, kenaikanNatrium: number) {


    const natriumSetelah = natriumAwal + kenaikanNatrium;

    if (Number(natriumAwal) === 0) {
        return "Baseline natrium serum tidak diketahui mungkin karena belum dilakukan pemeriksaan laboratorium, bila estimasi kenaikan < 12 mEq/L dapat dipertimbangkan dosis sesuai kenaikan maksimal per hari, namun tetap pertimbangkan klinis dan balans cairan pasien";
    }

    if (kenaikanNatrium <= 12) {
        if (natriumSetelah >= 135 && natriumSetelah <= 145) {
            return "Estimasi kadar natrium serum pasca pemberian natrium di rentang normal dengan laju kenaikan kadar natrium dalam batas rekomendasi, namun tetap pertimbangkan klinis dan balans cairan pasien";
        } else if (natriumSetelah < 135) {
            return "Estimasi kadar natrium serum pasca pemberian natrium di rentang hiponatremia dengan laju kenaikan kadar natrium dalam batas rekomendasi, saran naikkan pemberian natrium untuk mencapai nilai natrium serum normal dengan maksimal kenaikan natrium serum di 12 mEq/L/hari, namun tetap pertimbangkan klinis dan balans cairan pasien";
        } else if (natriumSetelah > 145) {
            return "Estimasi kadar natrium serum pasca pemberian natrium di rentang hipernatremia dengan laju kenaikan kadar natrium dalam batas rekomendasi, saran turunkan laju pemberian natrium, namun tetap pertimbangkan klinis dan balans cairan pasien";
        }
    } else {
        if (natriumSetelah >= 135 && natriumSetelah <= 145) {
            return "Estimasi kadar natrium serum pasca pemberian natrium di rentang normal, tapi estimasi laju kenaikan natrium melebihi batas rekomendasi, saran turunkan laju pemberian natrium, namun tetap pertimbangkan klinis dan balans cairan pasien";
        } else if (natriumSetelah < 135) {
            return "Estimasi kadar natrium serum pasca pemberian natrium di rentang hiponatremia dengan laju kenaikan kadar natrium melebihi batas rekomendasi, saran atur laju kenaikan maksimal 12 mEq/L/hari walaupun gagal koreksi, namun tetap pertimbangkan klinis dan balans cairan pasien";
        } else {
            return "Estimasi kadar natrium serum pasca pemberian natrium di rentang hipernatremia dengan laju kenaikan kadar natrium melebihi batas rekomendasi, saran turunkan laju pemberian natrium, namun tetap pertimbangkan klinis dan balans cairan pasien";
        }
    }
}


export function evaluasiLipid(usia: any, totalLipid: number) {
    if (Number(totalLipid) === 0) {
        return "Pasien tidak diberikan lipid, harap evaluasi kembali";
    }

    const kurangDari = (
        (usia === 0 && totalLipid < 1) ||
        (usia === 1 && totalLipid < 1) ||
        (usia === 2 && totalLipid < 2) ||
        (usia === 3 && totalLipid < 2.5) ||
        (usia >= 4 && totalLipid < 3)
    );

    if (kurangDari) {
        return "Total pemberian lipid lebih rendah dari kebutuhan sesuai usia aktual, namun tetap pertimbangkan klinis dan profil lipid terkini";
    }

    const lebihDari = (
        (usia === 0 && totalLipid > 1) ||
        (usia === 1 && totalLipid > 1.5) ||
        (usia === 2 && totalLipid > 2) ||
        (usia === 3 && totalLipid > 2.5) ||
        (usia >= 4 && totalLipid > 3)
    );

    if (lebihDari) {
        return "Total pemberian lipid melebihi kebutuhan maksimal sesuai usia aktual, namun tetap pertimbangkan klinis dan profil lipid terkini";
    }

    return "Total pemberian lipid sesuai kebutuhan berdasarkan usia aktual, namun tetap pertimbangkan klinis dan profil lipid terkini";
}


export function evaluasiProtein(usia: number, beratLahir: number, totalProtein: number) {
    if (Number(totalProtein) === 0) {
        return "Pasien tidak diberikan protein, harap evaluasi kembali";
    }

    const dalamRentangBerat = beratLahir >= 23 && beratLahir <= 32;

    if (dalamRentangBerat) {
        const kebutuhanRendah = (
            (usia === 0 && totalProtein < 2) ||
            (usia === 1 && totalProtein < 2.5) ||
            (usia === 2 && totalProtein < 3) ||
            (usia === 3 && totalProtein < 3.5) ||
            (usia >= 4 && totalProtein < 4)
        );

        if (kebutuhanRendah) {
            return "Jumlah protein yang diberikan lebih rendah dari kebutuhan protein sesuai usia aktual, namun tetap pertimbangkan klinis dan fungsi ginjal";
        }

        const kebutuhanTinggi = (
            (usia === 0 && totalProtein > 2.5) ||
            (usia === 1 && totalProtein > 3) ||
            (usia === 2 && totalProtein > 3.5) ||
            (usia >= 3 && totalProtein > 4)
        );

        if (kebutuhanTinggi) {
            return "Jumlah protein yang diberikan lebih tinggi dari kebutuhan protein sesuai usia aktual, namun tetap pertimbangkan klinis dan fungsi ginjal";
        }
    }

    return "Jumlah protein yang diberikan memenuhi kebutuhan protein sesuai usia aktual, namun tetap pertimbangkan klinis dan fungsi ginjal";
}


export function evaluasiGIR(usiaAktual: number, usiaGestasi: number, nilaiGIR: number) {
    if (nilaiGIR === 0 || isNaN(nilaiGIR) || nilaiGIR === null || nilaiGIR == 0.00) {
        return "Pasien tidak mendapatkan glukosa, harap evaluasi kembali";
    }

    const girKurang = (
        (usiaGestasi >= 23 && usiaGestasi <= 27 && (
            (usiaAktual === 0 && nilaiGIR < 4) ||
            (usiaAktual === 1 && nilaiGIR < 5) ||
            (usiaAktual === 2 && nilaiGIR < 6) ||
            (usiaAktual === 3 && nilaiGIR < 7) ||
            (usiaAktual === 4 && nilaiGIR < 8) ||
            (usiaAktual === 5 && nilaiGIR < 9) ||
            (usiaAktual >= 6 && nilaiGIR < 10)
        )) ||
        (usiaGestasi >= 28 && usiaGestasi <= 32 && (
            (usiaAktual === 0 && nilaiGIR < 4) ||
            (usiaAktual === 1 && nilaiGIR < 5) ||
            (usiaAktual === 2 && nilaiGIR < 7) ||
            (usiaAktual === 3 && nilaiGIR < 9) ||
            (usiaAktual >= 4 && nilaiGIR < 10)
        )) ||
        (usiaGestasi >= 33 && usiaGestasi <= 36 && (
            (usiaAktual === 0 && nilaiGIR < 4) ||
            (usiaAktual === 1 && nilaiGIR < 6) ||
            (usiaAktual === 2 && nilaiGIR < 7) ||
            (usiaAktual >= 3 && nilaiGIR < 8)
        ))
    );

    if (girKurang) {
        return "GIR yang diberikan lebih rendah dari kebutuhan sesuai usia gestasi dan aktual sehingga berisiko hipoglikemia, namun tetap pertimbangkan kondisi klinis dan kadar glukosa darah terakhir";
    }

    // Cek apakah GIR melebihi kebutuhan
    const girLebih = (
        (usiaGestasi >= 23 && usiaGestasi <= 27 && (
            (usiaAktual === 0 && nilaiGIR > 4) ||
            (usiaAktual === 1 && nilaiGIR > 5) ||
            (usiaAktual === 2 && nilaiGIR > 6) ||
            (usiaAktual === 3 && nilaiGIR > 7) ||
            (usiaAktual === 4 && nilaiGIR > 8) ||
            (usiaAktual === 5 && nilaiGIR > 9) ||
            (usiaAktual >= 6 && nilaiGIR > 10)
        )) ||
        (usiaGestasi >= 28 && usiaGestasi <= 32 && (
            (usiaAktual === 0 && nilaiGIR > 5) ||
            (usiaAktual === 1 && nilaiGIR > 7) ||
            (usiaAktual === 2 && nilaiGIR > 9) ||
            (usiaAktual >= 3 && nilaiGIR > 10)
        )) ||
        (usiaGestasi >= 33 && usiaGestasi <= 36 && (
            (usiaAktual === 0 && nilaiGIR > 6) ||
            (usiaAktual === 1 && nilaiGIR > 7) ||
            (usiaAktual >= 2 && nilaiGIR > 8)
        ))
    );

    if (girLebih) {
        return "GIR yang diberikan melebihi kebutuhan sesuai usia gestasi dan aktual sehingga berisiko hiperglikemia, namun tetap pertimbangkan kondisi klinis dan kadar glukosa darah terakhir";
    }

    return "GIR yang diberikan memenuhi kebutuhan sesuai usia gestasi dan aktual, namun tetap pertimbangkan kondisi klinis dan kadar glukosa darah terakhir";
}
export function osmolarity(
    B88: number, C84: number, B92: number, B8: number, C102: number, D102: number, C93: number,
    C94: number, C96: number, C95: number, C97: number, B82: number
) {
    if (Number(B88) === 0 || Number(C84) === 0) return 0;

    const hasil =
        safeDivide((B92 * B8 * 1000), B88) +
        safeDivide((((0.4 * C102) + (0.1 * D102)) * 1000 * 5), B88) +
        safeDivide((0.513 * C93 * 1000), B88) +
        safeDivide((C94 * 1000), B88) +
        safeDivide((C96 * 2 * 1000), B88) +
        safeDivide((C96 * 2 * 1000), B88) +
        safeDivide((0.93 * C95 * 1000), B88) +
        safeDivide((8 * C97 * 1000), B88) +
        safeDivide((B82 * B8 * 0.7 * 1000), C84);

    return hasil;
}
