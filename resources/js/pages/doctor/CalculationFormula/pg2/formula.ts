import { safeDivide } from '@/lib/utils'

export function calculateEstimateElectrolyte(
    B8: number,
    F54: number,
    C54: number,
    B102: number,
    B103: number
): number {

    if (B8 === 0) return 0;
    const max = Math.max(0, ((F54 - C54) / B8) + (B102 / B8) + ((B102 * 3.89) / B8))
    const rounded = Math.ceil((((B103 * 3.89) / B8) - (1.25 * B8)) * 100) / 100;
    const nilai = max
        + rounded;

    return nilai;
}


export function getCairanNote(B7: number, B8: number, B119: number) {
    if (B119 === 0) {
        return "Tidak ada cairan yang diberikan, evaluasi kembali kebutuhan cairan pasien";
    }

    const kondisiKurang = (
        (B8 >= 23 && B8 <= 27 && (
            (B7 === 0 && B119 < 80) ||
            (B7 === 1 && B119 < 100) ||
            (B7 === 2 && B119 < 120) ||
            (B7 === 3 && B119 < 140) ||
            (B7 >= 4 && B119 < 150)
        )) ||
        (B8 >= 28 && B8 <= 32 && (
            (B7 === 0 && B119 < 60) ||
            (B7 === 1 && B119 < 80) ||
            (B7 === 2 && B119 < 100) ||
            (B7 === 3 && B119 < 120) ||
            (B7 === 4 && B119 < 140) ||
            (B7 >= 5 && B119 < 150)
        )) ||
        (B8 >= 33 && B8 <= 36 && (
            (B7 === 0 && B119 < 60) ||
            (B7 === 1 && B119 < 80) ||
            (B7 === 2 && B119 < 100) ||
            (B7 === 3 && B119 < 120) ||
            (B7 === 4 && B119 < 140) ||
            (B7 >= 5 && B119 < 150)
        ))
    );

    const kondisiLebih = (
        (B8 >= 23 && B8 <= 27 && (
            (B7 === 0 && B119 > 80) ||
            (B7 === 1 && B119 > 100) ||
            (B7 === 2 && B119 > 120) ||
            (B7 === 3 && B119 > 140) ||
            (B7 >= 4 && B119 > 150)
        )) ||
        (B8 >= 28 && B8 <= 32 && (
            (B7 === 0 && B119 > 80) ||
            (B7 === 1 && B119 > 100) ||
            (B7 === 2 && B119 > 120) ||
            (B7 === 3 && B119 > 140) ||
            (B7 >= 4 && B119 > 150)
        )) ||
        (B8 >= 33 && B8 <= 36 && (
            (B7 === 0 && B119 > 80) ||
            (B7 === 1 && B119 > 100) ||
            (B7 === 2 && B119 > 120) ||
            (B7 === 3 && B119 > 140) ||
            (B7 >= 4 && B119 > 150)
        ))
    );

    if (kondisiKurang) {
        return "Total cairan yang diberikan lebih rendah dari kebutuhan cairan sesuai usia gestasi dan usia aktual, namun tetap pertimbangkan kondisi klinis dan balans cairan terkini";
    } else if (kondisiLebih) {
        return "Total cairan yang diberikan lebih tinggi dari kebutuhan cairan sesuai usia gestasi dan usia aktual, namun tetap pertimbangkan kondisi klinis dan balans cairan terkini";
    } else {
        return "Total cairan yang diberikan telah sesuai dengan kebutuhan harian untuk usia gestasi dan usia aktual pasien, namun tetap pertimbangkan klinis dan balans cairan terkini";
    }
}


export function kaliumWarning(B128: number, B7: number, C29: number) {
    if (B128 === 0) {
        if (C29 === 0) {
            return "Baseline kalium tidak diketahui, pasien tidak mendapatkan kalium, namun tetap pertimbangkan klinis, balans dan diuresis pasien";
        } else {
            return "Pasien tidak mendapatkan kalium, namun tetap pertimbangkan klinis, balans dan diuresis pasien";
        }
    }

    if (C29 === 0) {
        if ((B7 < 1.5 && B128 > 5) || (B7 >= 1.5 && B128 > 3)) {
            return "Baseline kalium serum tidak diketahui, dosis harian kalium melebihi rentang dosis harian untuk berat badan aktual, pertimbangkan risiko hiperkalemia, namun tetap pertimbangkan klinis, balans dan diuresis pasien";
        } else {
            return "Baseline kalium serum tidak diketahui, dosis harian kalium dalam batas rekomendasi harian, namun tetap pertimbangkan klinis, balans dan diuresis pasien";
        }
    }

    if ((B7 < 1.5 && B128 > 5) || (B7 >= 1.5 && B128 > 3)) {
        let note = "Dosis harian kalium melebihi rentang dosis kalium untuk berat badan aktual, saran turunkan dosis kalium, ";
        const estKalium = C29 + B128;

        if (estKalium > 5.5) {
            note += "kadar kalium serum pasca pemberian KCl diestimasi > 5,5";
        } else if (estKalium < 3.5) {
            note += "kadar kalium serum pasca pemberian KCl diestimasi masih < 3,5, saran atur ulang dosis bila belum melebihi batas maksimal";
        } else {
            note += "kadar kalium serum pasca pemberian KCl diestimasi berada di rentang normal";
        }

        return note + ", namun tetap pertimbangkan klinis, balans dan diuresis pasien";
    } else {
        let note = "Dosis harian kalium dalam batas rekomendasi, ";
        const estKalium = C29 + B128;

        if (estKalium > 5.5) {
            note += "kadar kalium serum pasca pemberian KCl diestimasi > 5,5, saran turunkan dosis kalium";
        } else if (estKalium < 3.5) {
            note += "kadar kalium serum pasca pemberian KCl diestimasi < 3,5, saran naikkan dosis sesuai kebutuhan dan batas maksimal harian";
        } else {
            note += "kadar kalium serum pasca pemberian KCl diestimasi berada di rentang normal";
        }

        return note + ", namun tetap pertimbangkan klinis, balans dan diuresis pasien";
    }
}


export function evaluateNatrium(C28: number, B125: number) {

    const hasil = C28 + Number(B125);

    if (C28 === 0) {
        return "Baseline natrium serum tidak diketahui mungkin karena belum dilakukan pemeriksaan laboratorium, bila estimasi kenaikan < 12 mEq/L dapat dipertimbangkan dosis sesuai kenaikan maksimal per hari" +
            ", namun tetap pertimbangkan klinis dan balans cairan pasien";
    }

    if (B125 <= 12 && hasil >= 135 && hasil <= 145) {
        return "Estimasi kadar natrium serum pasca pemberian natrium di rentang normal dengan laju kenaikan kadar natrium dalam batas rekomendasi" +
            ", namun tetap pertimbangkan klinis dan balans cairan pasien";
    }

    if (B125 <= 12 && hasil < 135) {
        return "Estimasi kadar natrium serum pasca pemberian natrium di rentang hiponatremia dengan laju kenaikan kadar natrium dalam batas rekomendasi" +
            ", saran naikkan pemberian natrium untuk mencapai nilai natrium serum normal dengan maksimal kenaikan natrium serum di 12 mEq/L/hari" +
            ", namun tetap pertimbangkan klinis dan balans cairan pasien";
    }

    if (B125 <= 12 && hasil > 145) {
        return "Estimasi kadar natrium serum pasca pemberian natrium di rentang hipernatremia dengan laju kenaikan kadar natrium dalam batas rekomendasi" +
            ", saran turunkan laju pemberian natrium" +
            ", namun tetap pertimbangkan klinis dan balans cairan pasien";
    }

    if (B125 > 12 && hasil >= 135 && hasil <= 145) {
        return "Estimasi kadar natrium serum pasca pemberian natrium di rentang normal, tapi estimasi laju kenaikan natrium melebihi batas rekomendasi" +
            ", saran turunkan laju pemberian natrium" +
            ", namun tetap pertimbangkan klinis dan balans cairan pasien";
    }

    if (B125 > 12 && hasil < 135) {
        return "Estimasi kadar natrium serum pasca pemberian natrium di rentang hiponatremia dengan laju kenaikan kadar natrium melebihi batas rekomendasi" +
            ", saran atur laju kenaikan maksimal 12 mEq/L/hari walaupun gagal koreksi" +
            ", namun tetap pertimbangkan klinis dan balans cairan pasien";
    }

    // Default / else (B125 > 12 && hasil > 145)
    return "Estimasi kadar natrium serum pasca pemberian natrium di rentang hipernatremia dengan laju kenaikan kadar natrium melebihi batas rekomendasi" +
        ", saran turunkan laju pemberian natrium" +
        ", namun tetap pertimbangkan klinis dan balans cairan pasien";
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


export function evaluasiProtein(B132: number, B7: number, B6: number) {

    if (B132 === 0) {
        return "Pasien tidak diberikan protein, harap evaluasi kembali";
    }

    if (
        (B7 >= 23 && B7 <= 32 && B6 === 0 && B132 < 2) ||
        (B7 >= 23 && B7 <= 32 && B6 === 1 && B132 < 2.5) ||
        (B7 >= 23 && B7 <= 32 && B6 === 2 && B132 < 3) ||
        (B7 >= 23 && B7 <= 32 && B6 === 3 && B132 < 3.5) ||
        (B7 >= 23 && B7 <= 32 && B6 >= 4 && B132 < 4)
    ) {
        return "Jumlah protein yang diberikan lebih rendah dari kebutuhan protein sesuai usia aktual, namun tetap pertimbangkan klinis dan fungsi ginjal";
    }

    if (
        (B7 >= 23 && B7 <= 32 && B6 === 0 && B132 > 2.5) ||
        (B7 >= 23 && B7 <= 32 && B6 === 1 && B132 > 3) ||
        (B7 >= 23 && B7 <= 32 && B6 === 2 && B132 > 3.5) ||
        (B7 >= 23 && B7 <= 32 && B6 >= 3 && B132 > 4)
    ) {
        return "Jumlah protein yang diberikan lebih tinggi dari kebutuhan protein sesuai usia aktual, namun tetap pertimbangkan klinis dan fungsi ginjal";
    }

    return "Jumlah protein yang diberikan memenuhi kebutuhan protein sesuai usia aktual, namun tetap pertimbangkan klinis dan fungsi ginjal";
}


export function evaluasiGIR(B133: number, B7: number, B6: number): string {
    if (B133 === 0) {
        return "Pasien tidak mendapatkan glukosa, harap evaluasi kembali";
    }

    const batasGIR = [
        // usia: [minB6, maxB6, batas rendah, batas tinggi]
        { usiaMin: 23, usiaMax: 27, batas: [4, 5, 6, 7, 8, 9, 10] },
        { usiaMin: 28, usiaMax: 32, batas: [4, 5, 7, 9, 10] },
        { usiaMin: 33, usiaMax: 36, batas: [4, 6, 7, 8] },
    ];

    for (const group of batasGIR) {
        if (B7 >= group.usiaMin && B7 <= group.usiaMax) {
            const index = Math.min(B6, group.batas.length - 1);
            const batasNilai = group.batas[index];

            if (B133 < batasNilai) {
                return "GIR yang diberikan lebih rendah dari kebutuhan sesuai usia gestasi dan aktual sehingga berisiko hipoglikemia, namun tetap pertimbangkan kondisi klinis dan kadar glukosa darah terakhir";
            }

            if (B133 > batasNilai) {
                return "GIR yang diberikan melebihi kebutuhan sesuai usia gestasi dan aktual sehingga berisiko hiperglikemia, namun tetap pertimbangkan kondisi klinis dan kadar glukosa darah terakhir";
            }

            break;
        }
    }

    return "GIR yang diberikan memenuhi kebutuhan sesuai usia gestasi dan aktual, namun tetap pertimbangkan kondisi klinis dan kadar glukosa darah terakhir";
}

export function osmolarity(
    B92: any, B8: any, B104: any, B105: any, B102: any,
    B99: any, B100: any, B101: any, B106: any, B83: any, C85: any
) {
    try {
        if (parseFloat(B106) === 0) return 0;

        const part1 = safeDivide((parseFloat(B92) * parseFloat(B8) * 1000), parseFloat(B106));
        const part2 = safeDivide((((0.4 * parseFloat(B104)) + (0.1 * parseFloat(B105))) * 1000 * 5), parseFloat(B106));
        const part3 = safeDivide((0.513 * parseFloat(B102) * 1000), parseFloat(B106));
        const part4 = safeDivide((parseFloat(B99) * 1000), parseFloat(B106));
        const part5 = safeDivide((0.93 * parseFloat(B100) * 1000), parseFloat(B106));
        const part6 = safeDivide((8 * parseFloat(B101) * 1000), parseFloat(B106));
        const part7 = parseFloat(B83) === 0 ? 0 : safeDivide((parseFloat(B83) * parseFloat(B8) * 0.7 * 1000), parseFloat(C85));

        const result = part1 + part2 + part3 + part4 + part5 + part6 + part7;

        return isFinite(result) ? result : 0;
    } catch (e) {
        return 0;
    }
}

export function getPGVolume(
    total_fluid_volume: any,
    total_fluid_continue: any,
    total_fluid_intermitten: any,
    correction_intermitten_daily_total: any,
    prc_transfusion_amount: any,
    other_transfusion_total: any,
    nutrition_total: any,
    parental_total: any,
    correction_continue_total_fluid: any
) {

    return (
        parseFloat(total_fluid_volume) -
        (
            parseFloat(total_fluid_continue) +
            parseFloat(total_fluid_intermitten) +
            parseFloat(correction_intermitten_daily_total) +
            parseFloat(prc_transfusion_amount) +
            parseFloat(other_transfusion_total) +
            parseFloat(nutrition_total) +
            parseFloat(parental_total) +
            parseFloat(correction_continue_total_fluid)
        )

    );


}
