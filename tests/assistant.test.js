import { test } from 'node:test';
import assert from 'node:assert/strict';
import { respond, NOT_FOUND } from '../src/assistant/engine.js';

const ask = (q, s) => respond(q, s);
const types = (r) => r.actions.map((a) => a.type);

test('agendamento conduz por especialidade, profissional e canal', () => {
  const r1 = ask('Quero marcar uma consulta.');
  assert.match(r1.text, /Qual especialidade/);
  assert.equal(r1.actions[0].value, 'booking:specialty:dermatologia');
  const r2 = ask(r1.actions[0].value, r1.state);
  assert.match(r2.text, /preferência/);
  const r3 = ask('booking:doctor:marina-bittencourt', r2.state);
  assert.deepEqual(types(r3), ['whatsapp', 'phone']);
  assert.match(r3.actions[0].text, /Dermatologia com a Dra\. Marina Bittencourt/);
});

test('responde contatos e endereço com dados oficiais', () => {
  assert.match(ask('Qual o telefone?').text, /\(21\) 3549-0047/);
  assert.match(ask('Qual o endereço?').text, /Av\. das Américas, 2480, Bloco 3, Sala S120/);
  assert.ok(types(ask('Como chegar?')).includes('map'));
  assert.match(ask('qual o whatsapp').text, /97116-4164/);
});

test('não inventa: sábado, convênio e procedimentos admitem ausência de informação', () => {
  assert.match(ask('Vocês atendem sábado?').text, /não consta/);
  assert.match(ask('Vocês aceitam convênio?').text, /não divulga/);
  assert.match(ask('Quais procedimentos vocês fazem?').text, /não é divulgada/);
  assert.match(ask('Vocês fazem botox?').text, /não é divulgada/);
});

test('segurança médica: não diagnostica nem prescreve', () => {
  for (const q of ['Tenho uma mancha nas costas, é câncer?', 'Qual pomada posso usar na acne?', 'Qual a dose de isotretinoína?', 'Pode interpretar meu exame?']) {
    const r = ask(q);
    assert.match(r.text, /Não consigo avaliar/, q);
  }
});

test('emergência orienta SAMU', () => {
  const r = ask('Estou com falta de ar e inchaço, é emergência');
  assert.match(r.text, /192/);
});

test('pergunta sobre a política de urgência vai para a FAQ, não para o alerta', () => {
  assert.match(ask('Vocês atendem urgências?').text, /clínica ambulatorial/);
});

test('médicas e perfis', () => {
  assert.match(ask('Quais médicos atendem?').text, /Marina Bittencourt[\s\S]*Bruna Duque Estrada[\s\S]*Carla Tamler/);
  assert.match(ask('Quem é a Dra. Bruna?').text, /RQE 24366/);
  assert.match(ask('especialidades').text, /dermatologia/);
});

test('horários e handoff', () => {
  assert.match(ask('Qual o horário de funcionamento?').text, /Terça-feira: 8h às 22h/);
  assert.deepEqual(types(ask('Quero falar com alguém')), ['whatsapp', 'phone']);
});

test('usa a FAQ quando a pergunta corresponde', () => {
  assert.match(ask('Tem estacionamento?').text, /estacionamento/);
  assert.match(ask('Qual o CNPJ?').text, /30\.776\.724\/0001-92/);
  assert.match(ask('o que levar no dia').text, /documento com foto/);
});

test('fallback honesto quando não sabe', () => {
  const r = ask('Qual a cor favorita do gato da recepcionista?');
  assert.equal(r.text, NOT_FOUND);
  assert.equal(r.matched, false);
  assert.deepEqual(types(r), ['handoff']);
});

test('perguntas sobre cabelo indicam a tricologista sem diagnosticar', () => {
  const r = ask('Meu cabelo está caindo muito, o que pode ser?');
  assert.match(r.text, /Não consigo avaliar/);
  assert.match(r.note, /tricologia/);
});

test('formação da equipe vem da FAQ', () => {
  assert.match(ask('Qual a formação da equipe?').text, /Instituto de Dermatologia Prof\. Rubem David Azulay/);
});
