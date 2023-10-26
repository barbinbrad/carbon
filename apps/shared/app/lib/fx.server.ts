import axios from "axios";

type ExchangeClientOptions = {
  apiKey?: string;
  apiUrl?: string;
  baseCurrency: Currency;
};

type Currency =
  | "AFN"
  | "AFA"
  | "ALL"
  | "ALK"
  | "DZD"
  | "ADP"
  | "AOA"
  | "AOK"
  | "AON"
  | "AOR"
  | "ARA"
  | "ARS"
  | "ARM"
  | "ARP"
  | "ARL"
  | "AMD"
  | "AWG"
  | "AUD"
  | "ATS"
  | "AZN"
  | "AZM"
  | "BSD"
  | "BHD"
  | "BDT"
  | "BBD"
  | "BYN"
  | "BYB"
  | "BYR"
  | "BEF"
  | "BEC"
  | "BEL"
  | "BZD"
  | "BMD"
  | "BTN"
  | "BOB"
  | "BOL"
  | "BOV"
  | "BOP"
  | "BAM"
  | "BAD"
  | "BAN"
  | "BWP"
  | "BRC"
  | "BRZ"
  | "BRE"
  | "BRR"
  | "BRN"
  | "BRB"
  | "BRL"
  | "GBP"
  | "BND"
  | "BGL"
  | "BGN"
  | "BGO"
  | "BGM"
  | "BUK"
  | "BIF"
  | "XPF"
  | "KHR"
  | "CAD"
  | "CVE"
  | "KYD"
  | "XAF"
  | "CLE"
  | "CLP"
  | "CLF"
  | "CNX"
  | "CNY"
  | "CNH"
  | "COP"
  | "COU"
  | "KMF"
  | "CDF"
  | "CRC"
  | "HRD"
  | "HRK"
  | "CUC"
  | "CUP"
  | "CYP"
  | "CZK"
  | "CSK"
  | "DKK"
  | "DJF"
  | "DOP"
  | "NLG"
  | "XCD"
  | "DDM"
  | "ECS"
  | "ECV"
  | "EGP"
  | "GQE"
  | "ERN"
  | "EEK"
  | "ETB"
  | "EUR"
  | "XBA"
  | "XEU"
  | "XBB"
  | "XBC"
  | "XBD"
  | "FKP"
  | "FJD"
  | "FIM"
  | "FRF"
  | "XFO"
  | "XFU"
  | "GMD"
  | "GEK"
  | "GEL"
  | "DEM"
  | "GHS"
  | "GHC"
  | "GIP"
  | "XAU"
  | "GRD"
  | "GTQ"
  | "GWP"
  | "GNF"
  | "GNS"
  | "GYD"
  | "HTG"
  | "HNL"
  | "HKD"
  | "HUF"
  | "IMP"
  | "ISK"
  | "ISJ"
  | "INR"
  | "IDR"
  | "IRR"
  | "IQD"
  | "IEP"
  | "ILS"
  | "ILP"
  | "ILR"
  | "ITL"
  | "JMD"
  | "JPY"
  | "JOD"
  | "KZT"
  | "KES"
  | "KWD"
  | "KGS"
  | "LAK"
  | "LVL"
  | "LVR"
  | "LBP"
  | "LSL"
  | "LRD"
  | "LYD"
  | "LTL"
  | "LTT"
  | "LUL"
  | "LUC"
  | "LUF"
  | "MOP"
  | "MKD"
  | "MKN"
  | "MGA"
  | "MGF"
  | "MWK"
  | "MYR"
  | "MVR"
  | "MVP"
  | "MLF"
  | "MTL"
  | "MTP"
  | "MRU"
  | "MRO"
  | "MUR"
  | "MXV"
  | "MXN"
  | "MXP"
  | "MDC"
  | "MDL"
  | "MCF"
  | "MNT"
  | "MAD"
  | "MAF"
  | "MZE"
  | "MZN"
  | "MZM"
  | "MMK"
  | "NAD"
  | "NPR"
  | "ANG"
  | "TWD"
  | "NZD"
  | "NIO"
  | "NIC"
  | "NGN"
  | "KPW"
  | "NOK"
  | "OMR"
  | "PKR"
  | "XPD"
  | "PAB"
  | "PGK"
  | "PYG"
  | "PEI"
  | "PEN"
  | "PES"
  | "PHP"
  | "XPT"
  | "PLN"
  | "PLZ"
  | "PTE"
  | "GWE"
  | "QAR"
  | "XRE"
  | "RHD"
  | "RON"
  | "ROL"
  | "RUB"
  | "RUR"
  | "RWF"
  | "SVC"
  | "WST"
  | "SAR"
  | "RSD"
  | "CSD"
  | "SCR"
  | "SLL"
  | "XAG"
  | "SGD"
  | "SKK"
  | "SIT"
  | "SBD"
  | "SOS"
  | "ZAR"
  | "ZAL"
  | "KRH"
  | "KRW"
  | "KRO"
  | "SSP"
  | "SUR"
  | "ESP"
  | "ESA"
  | "ESB"
  | "XDR"
  | "LKR"
  | "SHP"
  | "XSU"
  | "SDD"
  | "SDG"
  | "SDP"
  | "SRD"
  | "SRG"
  | "SZL"
  | "SEK"
  | "CHF"
  | "SYP"
  | "STN"
  | "STD"
  | "TVD"
  | "TJR"
  | "TJS"
  | "TZS"
  | "XTS"
  | "THB"
  | "XXX"
  | "TPE"
  | "TOP"
  | "TTD"
  | "TND"
  | "TRY"
  | "TRL"
  | "TMT"
  | "TMM"
  | "USD"
  | "USN"
  | "USS"
  | "UGX"
  | "UGS"
  | "UAH"
  | "UAK"
  | "AED"
  | "UYW"
  | "UYU"
  | "UYP"
  | "UYI"
  | "UZS"
  | "VUV"
  | "VES"
  | "VEB"
  | "VEF"
  | "VND"
  | "VNN"
  | "CHE"
  | "CHW"
  | "XOF"
  | "YDD"
  | "YER"
  | "YUN"
  | "YUD"
  | "YUM"
  | "YUR"
  | "ZWN"
  | "ZRN"
  | "ZRZ"
  | "ZMW"
  | "ZMK"
  | "ZWD"
  | "ZWR"
  | "ZWL"
  | "XUA";

type Rates = { [key in Currency]?: number };

type ExchangeRatesSuccessResponse = {
  success: boolean;
  timestamp: number;
  base: Currency;
  date: string;
  rates: Rates;
};

type ExchangeRatesErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

type ExchangeRatesResponse =
  | ExchangeRatesErrorResponse
  | ExchangeRatesSuccessResponse;

export class ExchangeRatesClient {
  #apiKey: string;
  #apiUrl: string;
  #baseCurrency: Currency;

  constructor(options: ExchangeClientOptions) {
    if (!options.apiKey) throw new Error("EXCHANGE_RATES_API_KEY not set");
    if (!options.apiUrl) throw new Error("EXCHANGE_RATES_API_URL not set");
    this.#apiKey = options.apiKey;
    this.#apiUrl = options.apiUrl;
    this.#baseCurrency = options.baseCurrency ?? "USD";
  }

  getMetaData() {
    return {
      apiUrl: this.#apiUrl,
      baseCurrency: this.#baseCurrency,
    };
  }

  async getExchangeRates(base?: Currency): Promise<Rates> {
    const { data } = await axios.get<ExchangeRatesResponse>(
      `${this.#apiUrl}?access_key=${this.#apiKey}`
    );

    if ("success" in data && data.success === true) {
      const baseRate = data.rates[base ?? this.#baseCurrency];
      if (!baseRate) throw new Error("Base rate not found in response");

      const convertedRates = Object.entries(data.rates).reduce<Rates>(
        (acc, [currency, value]) => {
          return {
            ...acc,
            [currency]: value / baseRate,
          };
        },
        {
          [data.base]: 1,
        }
      );

      return convertedRates;
    }

    throw new Error("Unrecognized response from exchange rates server");
  }
}

const apiKey = process.env.EXCHANGE_RATES_API_KEY;
const apiUrl = process.env.EXCHANGE_RATES_API_URL;

export const exchangeRatesClient = new ExchangeRatesClient({
  apiKey,
  apiUrl,
  baseCurrency: "USD",
});
