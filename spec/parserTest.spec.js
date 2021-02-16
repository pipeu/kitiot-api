import fs from 'fs';
import { expect } from 'chai';
import { parseEmail } from '../lib/EmailService';

describe('Email Parser', () => {

  it('should parse email correctly', async () => {
    const readStream = fs.createReadStream('spec/emails/0clqh4al5kqnd37bb9a8lna12vra18ma3vmnug81');
    const result = await parseEmail(readStream);
    expect(result).to.have.property('timestamp').equal(1557154471000);
    expect(result).to.have.property('content');
    expect(result).to.have.property('summary').equal('Em anexo segue o comprovant...');
    expect(result).to.have.property('sender').to.have.property('name').equal('Franca');
    expect(result).to.have.property('sender').to.have.property('address').equal('franca.gerodetti@terra.com.br');
    expect(result).to.have.property('subject').equal('RES: NetCartas - Renove sua Assinatura');
  });

  it('should parse another email correctly', async () => {
    const readStream = fs.createReadStream('spec/emails/0bu6807rpkk1nk0vgabun6ho7ne8ko6f63940vg1');
    const result = await parseEmail(readStream);
    expect(result).to.have.property('timestamp').equal(1556479272000);
    expect(result).to.have.property('content');
    expect(result).to.have.property('summary').equal('Podem apagar meus abandonos...');
    expect(result).to.have.property('sender').to.have.property('name').equal('J. Martins Coutinho');
    expect(result).to.have.property('sender').to.have.property('address').equal('j.martinscoutinho@hotmail.com');
    expect(result).to.have.property('subject').equal('RE: RE: RE: Abandonos');
  });

});