// const $ = require("jquery");

let globalCountriesData = []
let lastValidCode = "";
let lastValidDialCode = "";

$.getJSON("/data/countries.json", function (data) {
	globalCountriesData = data;

	const userCountryCode = $("#countryCode").val();
	if (userCountryCode) {
		const match = globalCountriesData.find(c => c.countryCode2 === userCountryCode);
		if (match) {
			$("#countryName").val(match.name);
			$("#mobCode").val(match.dialCode);
			lastValidCode = match.countryCode2;
			lastValidDialCode = match.dialCode;
		}
	}
});


$("#countryName").on("input", function () {
	let inputVal = $(this).val().toLowerCase();
	let $datalist = $("#countries");
	$datalist.empty();

	let matchedCountry = null;

	globalCountriesData.forEach(country => {
		if (country.name.toLowerCase().startsWith(inputVal)) {
			$datalist.append(
				$("<option>").val(country.name)
			);
			if (!matchedCountry) {
				matchedCountry = country;
			}
		}
	});

	if (matchedCountry) {
		$("#countryCode").val(matchedCountry.countryCode2);
		$("#mobCode").val(matchedCountry.dialCode);
		lastValidCode = matchedCountry.countryCode2;
		lastValidDialCode = matchedCountry.dialCode;
	} else if (lastValidCode && lastValidDialCode) {
		$("#countryCode").val(lastValidCode);
		$("#mobCode").val(lastValidDialCode);
	} else {
		$("#countryCode").val("");
		$("#mobCode").val("");
	}
});
