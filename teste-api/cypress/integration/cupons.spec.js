/// <reference types="cypress" />

// Importar contrato e objetos da página
import contrato from '../contracts/cupom.contract';
import CupomPagePage from '../support/page-objects/CupomPage.page';

describe('Testes da Funcionalidade Cupons', () => {
    // Token de autenticação (sempre proteja informações sensíveis)
    const token = "YWRtaW5fZWJhYzpAYWRtaW4hJmJAYyEyMDIy";

    it('Deve validar contrato de cupons', () => {
        // Fazer uma solicitação para obter cupons e validar o contrato
        cy.request({
            url: 'coupons',
            headers: { authorization: `Basic ${token}` }
        }).then(response => {
            contrato.validateAsync(response.body.value);
        });
    });

    it('Deve listar os cupons com sucesso', () => {
        // Realizar a listagem de cupons e fazer asserções
        cy.listarCupons(token).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body[0]).to.have.property('code');
            expect(response.duration).to.be.lessThan(900);
        });
    });

    it('Deve cadastrar um cupom com sucesso', () => {
        // Inserir um cupom falso e realizar o cadastro
        const cuponsPage = CupomPagePage.inserirCupomFaker();
        cy.cadastrarCupom(
            token, cuponsPage.code, cuponsPage.amount, cuponsPage.dicount_type, cuponsPage.description
        ).then((response) => {
            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('code');
        });
    });
});
