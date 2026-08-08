function iniciarPesquisa() {
    alert('Olá tudo bem? sejam muito bem-vindos a nossa página para organização churrasco da Formação Tech Itaú, mas primeiramente, preencha os dados para que possamos ter uma estimativa de pessoas, consumo e melhor data para realização de nosso evento.');

    var homens = parseFloat(prompt("Informe quantos homens foram convidados:"));
    var mulheres = parseFloat(prompt("Informe quantas mulheres foram convidadas:"));
    var kids = parseFloat(prompt("Informe a quantidade de crianças que irão acompanhar seus pais:"));
    var melhorData = prompt("Informe qual seria melhor data");

    if (isNaN(homens)) { homens = 0; }
    if (isNaN(mulheres)) { mulheres = 0; }
    if (isNaN(kids)) { kids = 0; }
    if (melhorData === null || melhorData === '') { melhorData = 'a confirmar'; }

    var cervejaHomens = 5;
    var cervejaMulheres = 3;
    var refriKids = 5;

    var acompHomens = 0.50;
    var acompMulheres = 0.60;
    var acompKids = 0.30;

    var carneHomens = 0.80;
    var carneMulheres = 0.70;
    var carneKids = 0.40;

    var totalCervejaHomens = cervejaHomens * homens;
    var totalCervejaMulheres = cervejaMulheres * mulheres;
    var totalCervejas = totalCervejaHomens + totalCervejaMulheres;

    var totalRefrigerantes = refriKids * kids;

    var totalAcompHomens = acompHomens * homens;
    var totalAcompMulheres = acompMulheres * mulheres;
    var totalAcompKids = acompKids * kids;
    var totalAcompanhamento = totalAcompHomens + totalAcompMulheres + totalAcompKids;

    var totalCarneHomens = carneHomens * homens;
    var totalCarneMulheres = carneMulheres * mulheres;
    var totalCarneKids = carneKids * kids;
    var totalCarnes = totalCarneHomens + totalCarneMulheres + totalCarneKids;

    function setText(id, text) {
        var el = document.getElementById(id);
        if (el) { el.innerHTML = text; }
    }

    setText('res-data', 'Vocês escolheram a melhor data para: ' + melhorData);
    setText('res-homens', 'Total de ' + homens + ' homens que consumirão: ' + '<br>' + totalCervejaHomens + ' cervejas, ' + '<br>' + totalCarneHomens + ' kg de carne, ' + '<br>' + totalAcompHomens + ' kg de acompanhamento');
    setText('res-mulheres', 'Total de ' + mulheres + ' mulheres que consumirão: ' + '<br>' + totalCervejaMulheres + ' cervejas, ' + '<br>' + totalCarneMulheres + ' kg de carne, ' + '<br>' + totalAcompMulheres + ' kg de acompanhamento');
    setText('res-criancas', 'Total de ' + kids + ' crianças que consumirão: ' + '<br>' + totalRefrigerantes + ' refrigerantes, ' + '<br>' + totalCarneKids + ' kg de carne, ' + '<br>' + totalAcompKids + ' kg de acompanhamento');
    setText('res-carnes', 'Total de ' + totalCarnes + ' kgs de carnes serão consumidas');
    setText('res-cervejas', 'Total de ' + totalCervejas + ' cervejas serão consumidas');
    setText('res-acompanhamentos', 'Total de ' + totalAcompanhamento + ' kgs acompanhamentos serão consumidas');
    setText('res-refri', 'Total de ' + totalRefrigerantes + ' refrigerantes serão consumidos');

    alert('Muito obrigado por responder, agora, veja a estimativa de consumo logo abaixo');
}