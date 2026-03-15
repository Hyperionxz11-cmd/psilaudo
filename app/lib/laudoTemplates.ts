interface LaudoParams {
  tipo: string;
  paciente: { nome: string; dataNasc: string; sexo: string; escolaridade: string; profissao: string };
  clinico: { dataAvaliacao: string; instrumentos: string; observacoesClinicas: string; conclusao: string };
  psicologo: { nome: string; crp: string };
  dataAvaliacao: string;
}

function formatDate(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function calcIdade(dataNasc: string): string {
  if (!dataNasc) return '';
  const nasc = new Date(dataNasc);
  const hoje = new Date();
  let idade = hoje.getFullYear() - nasc.getFullYear();
  if (hoje.getMonth() < nasc.getMonth() || (hoje.getMonth() === nasc.getMonth() && hoje.getDate() < nasc.getDate())) idade--;
  return `${idade} anos`;
}

function conclusaoTexto(conclusao: string, tipo: string): string {
  const mapa: Record<string, Record<string, string>> = {
    apto: {
      arma: 'APTO(A) psicologicamente para o porte e/ou aquisição de arma de fogo',
      transito: 'APTO(A) psicologicamente para conduzir veículos automotores',
      educacional: 'Apresenta condições psicológicas compatíveis com as necessidades identificadas',
      adocao: 'HABILITADO(A) psicologicamente para adoção',
      pericial: 'apresenta capacidade psíquica preservada, sendo considerado(a) CAPAZ',
      cargo: 'APTO(A) psicologicamente para o exercício do cargo pretendido',
    },
    inapto: {
      arma: 'INAPTO(A) psicologicamente para o porte e/ou aquisição de arma de fogo',
      transito: 'INAPTO(A) psicologicamente para conduzir veículos automotores',
      educacional: 'Apresenta condições que requerem suporte especializado complementar',
      adocao: 'NÃO HABILITADO(A) psicologicamente para adoção no momento atual',
      pericial: 'apresenta comprometimento psíquico significativo, sendo considerado(a) INCAPAZ',
      cargo: 'INAPTO(A) psicologicamente para o exercício do cargo pretendido',
    },
    apto_restritivo: {
      arma: 'APTO(A) COM RESTRIÇÕES psicologicamente para o porte e/ou aquisição de arma de fogo',
      transito: 'APTO(A) COM RESTRIÇÕES para conduzir veículos automotores — sujeito a reavaliação',
      educacional: 'Apresenta condições psicológicas que requerem acompanhamento e adaptações',
      adocao: 'HABILITADO(A) COM RESSALVAS — recomenda-se acompanhamento psicológico durante o processo',
      pericial: 'apresenta capacidade psíquica parcialmente comprometida, sendo considerado(a) PARCIALMENTE CAPAZ',
      cargo: 'APTO(A) COM RESTRIÇÕES — recomenda-se reavaliação após 6 meses',
    },
  };
  return mapa[conclusao]?.[tipo] || mapa[conclusao]?.cargo || '';
}

function templateArma(p: LaudoParams): string {
  const { paciente, clinico, psicologo } = p;
  const conc = conclusaoTexto(clinico.conclusao, 'arma');
  return `LAUDO DE AVALIAÇÃO PSICOLÓGICA
PORTE/AQUISIÇÃO DE ARMA DE FOGO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DADOS DE IDENTIFICAÇÃO

Nome: ${paciente.nome}
Data de Nascimento: ${formatDate(paciente.dataNasc)} (${calcIdade(paciente.dataNasc)})
Sexo: ${paciente.sexo}
Profissão: ${paciente.profissao || 'Não informado'}
Escolaridade: ${paciente.escolaridade || 'Não informado'}
Data da Avaliação: ${formatDate(clinico.dataAvaliacao)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJETIVO DA AVALIAÇÃO

O presente laudo tem por objetivo verificar a aptidão psicológica do(a) avaliado(a) para o porte e/ou aquisição de arma de fogo, conforme determinado pelo Estatuto do Desarmamento (Lei 10.826/2003) e pela Resolução CFP nº 012/2011.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUMENTOS UTILIZADOS

${clinico.instrumentos || 'Entrevista clínica estruturada, observação comportamental e testes psicológicos padronizados'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
RESULTADOS E ANÁLISE

${clinico.observacoesClinicas || `Durante a avaliação, ${paciente.nome} demonstrou comportamento colaborativo e adequado ao contexto. A entrevista clínica revelou ausência de indicadores significativos de psicopatologia. Os instrumentos aplicados não evidenciaram comprometimentos cognitivos, emocionais ou comportamentais que contraindiquem o porte/aquisição de arma de fogo. O(A) avaliado(a) apresenta capacidade de controle de impulsos, equilíbrio emocional e senso crítico preservados.`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCLUSÃO

Com base nos resultados obtidos através dos instrumentos e procedimentos técnicos empregados, conclui-se que ${paciente.nome} encontra-se ${conc}.

Este laudo é válido por um período de 3 (três) anos a partir da data de emissão, conforme legislação vigente.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formatDate(clinico.dataAvaliacao)}

_________________________________
${psicologo.nome}
Psicólogo(a) — CRP ${psicologo.crp || 'XX/XXXXXX'}`;
}

function templateTransito(p: LaudoParams): string {
  const { paciente, clinico, psicologo } = p;
  const conc = conclusaoTexto(clinico.conclusao, 'transito');
  return `LAUDO DE AVALIAÇÃO PSICOLÓGICA
HABILITAÇÃO PARA CONDUTORES DE VEÍCULOS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DADOS DE IDENTIFICAÇÃO

Nome: ${paciente.nome}
Data de Nascimento: ${formatDate(paciente.dataNasc)} (${calcIdade(paciente.dataNasc)})
Sexo: ${paciente.sexo}
Profissão: ${paciente.profissao || 'Não informado'}
Escolaridade: ${paciente.escolaridade || 'Não informado'}
Data da Avaliação: ${formatDate(clinico.dataAvaliacao)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
FUNDAMENTAÇÃO LEGAL

Resolução CONTRAN nº 425/2012 e Resolução CFP nº 007/2009. A avaliação psicológica para habilitação de condutores visa verificar as condições necessárias ao exercício seguro das tarefas de condução, considerando atenção, memória, raciocínio, equilíbrio emocional e resistência à frustração.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUMENTOS UTILIZADOS

${clinico.instrumentos || 'Bateria de testes cognitivos e atencionais, avaliação da personalidade, entrevista clínica, observação do comportamento'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANÁLISE DOS RESULTADOS

${clinico.observacoesClinicas || `Os resultados obtidos indicam que ${paciente.nome} apresenta capacidade atencional, perceptiva e de processamento de informações dentro dos parâmetros esperados para a condução de veículos. Não foram identificados indicadores de impulsividade patológica, comportamento de risco ou comprometimentos emocionais que pudessem prejudicar a segurança no trânsito. O(A) candidato(a) demonstra compreensão das normas de trânsito e responsabilidade nas situações avaliadas.`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCLUSÃO

Com base nos resultados da avaliação psicológica realizada, declaro que ${paciente.nome} encontra-se ${conc}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formatDate(clinico.dataAvaliacao)}

_________________________________
${psicologo.nome}
Psicólogo(a) — CRP ${psicologo.crp || 'XX/XXXXXX'}`;
}

function templateEducacional(p: LaudoParams): string {
  const { paciente, clinico, psicologo } = p;
  return `LAUDO PSICOLÓGICO EDUCACIONAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DADOS DE IDENTIFICAÇÃO

Nome: ${paciente.nome}
Data de Nascimento: ${formatDate(paciente.dataNasc)} (${calcIdade(paciente.dataNasc)})
Sexo: ${paciente.sexo}
Escolaridade: ${paciente.escolaridade || 'Não informado'}
Data da Avaliação: ${formatDate(clinico.dataAvaliacao)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DEMANDA E OBJETIVO

O presente laudo foi elaborado a pedido da família e/ou instituição de ensino com o objetivo de avaliar o desenvolvimento cognitivo, emocional e comportamental de ${paciente.nome}, identificando necessidades educacionais especiais e/ou recursos de aprendizagem.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUMENTOS E PROCEDIMENTOS

${clinico.instrumentos || 'Entrevista com pais/responsáveis, entrevista com a criança/adolescente, observação lúdica, avaliação cognitiva, avaliação de personalidade, análise de material escolar'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANÁLISE E DISCUSSÃO

${clinico.observacoesClinicas || `A avaliação de ${paciente.nome} revelou um perfil cognitivo com características relevantes para o contexto educacional. Foram observados aspectos relacionados à atenção, memória de trabalho, processamento fonológico e habilidades visuoespaciais. O comportamento durante a avaliação foi adequado, com cooperação e engajamento nas atividades propostas. Os dados obtidos permitem traçar um perfil de necessidades e potencialidades que devem ser considerados no planejamento pedagógico individualizado.`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCLUSÃO E RECOMENDAÇÕES

${conclusaoTexto(clinico.conclusao, 'educacional')}. Recomenda-se a elaboração de Plano Educacional Individualizado (PEI) com adaptações curriculares e estratégias de ensino diferenciadas, bem como acompanhamento psicopedagógico sistemático.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formatDate(clinico.dataAvaliacao)}

_________________________________
${psicologo.nome}
Psicólogo(a) — CRP ${psicologo.crp || 'XX/XXXXXX'}`;
}

function templateGenerico(p: LaudoParams): string {
  const { paciente, clinico, psicologo } = p;
  const labels: Record<string, string> = { adocao: 'ADOÇÃO', pericial: 'PERICIAL JUDICIAL', cargo: 'CARGO PÚBLICO' };
  const conc = conclusaoTexto(clinico.conclusao, p.tipo);
  return `LAUDO PSICOLÓGICO — ${labels[p.tipo] || p.tipo.toUpperCase()}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DADOS DE IDENTIFICAÇÃO

Nome: ${paciente.nome}
Data de Nascimento: ${formatDate(paciente.dataNasc)} (${calcIdade(paciente.dataNasc)})
Sexo: ${paciente.sexo}
Profissão: ${paciente.profissao || 'Não informado'}
Escolaridade: ${paciente.escolaridade || 'Não informado'}
Data da Avaliação: ${formatDate(clinico.dataAvaliacao)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
INSTRUMENTOS UTILIZADOS

${clinico.instrumentos || 'Entrevista clínica estruturada, testes psicológicos padronizados, observação comportamental'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ANÁLISE DOS RESULTADOS

${clinico.observacoesClinicas || `Durante a avaliação psicológica, ${paciente.nome} demonstrou comportamento colaborativo. Os instrumentos aplicados foram analisados conforme normatização vigente. Os resultados obtidos permitem caracterizar o perfil psicológico do(a) avaliado(a) de forma consistente, sem indicadores de comprometimentos significativos que contraindiquem a demanda avaliada.`}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CONCLUSÃO

Com base nas informações obtidas, conclui-se que ${paciente.nome} ${conc}.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${formatDate(clinico.dataAvaliacao)}

_________________________________
${psicologo.nome}
Psicólogo(a) — CRP ${psicologo.crp || 'XX/XXXXXX'}`;
}

export function gerarLaudo(p: LaudoParams): string {
  switch (p.tipo) {
    case 'arma': return templateArma(p);
    case 'transito': return templateTransito(p);
    case 'educacional': return templateEducacional(p);
    default: return templateGenerico(p);
  }
}
