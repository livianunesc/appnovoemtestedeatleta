import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

type Tab = 'Comunidade' | 'Provas' | 'Atividade' | 'Perfil';
type Post = { id: number; name: string; initials: string; location: string; text: string; distance?: string; pace?: string; likes: number };
const initialPosts: Post[] = [
  { id: 1, name: 'Marina Costa', initials: 'MC', location: 'São Paulo · Hoje, 07:12', text: 'O melhor jeito de começar o dia. Quem vem correr no parque amanhã? ☀️', distance: '8,42', pace: '5:24', likes: 24 },
  { id: 2, name: 'Rafael Lima', initials: 'RL', location: 'Curitiba · Há 2 horas', text: 'Inscrição feita para minha primeira meia maratona! Agora é manter a constância. 🏃', likes: 18 },
];
const races = [
  { id: 1, day: '18', month: 'OUT', name: 'Circuito do Parque', city: 'São Paulo, SP', distance: '5 km · 10 km', category: 'Rua' },
  { id: 2, day: '08', month: 'NOV', name: 'Meia da Orla', city: 'Rio de Janeiro, RJ', distance: '5 km · 21 km', category: 'Rua' },
  { id: 3, day: '22', month: 'NOV', name: 'Desafio da Serra', city: 'Curitiba, PR', distance: '12 km · 24 km', category: 'Trilha' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('Comunidade');
  const [posts, setPosts] = useState(initialPosts);
  const [liked, setLiked] = useState<number[]>([]);
  const [interested, setInterested] = useState<number[]>([]);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [composer, setComposer] = useState(false);
  const [draft, setDraft] = useState('');
  const [profileEditor, setProfileEditor] = useState(false);
  const [name, setName] = useState('Você');
  const [bio, setBio] = useState('Cada quilômetro, uma nova história.');
  const [nameDraft, setNameDraft] = useState('');
  const [bioDraft, setBioDraft] = useState('');
  const toggle = (items: number[], id: number) => items.includes(id) ? items.filter(item => item !== id) : [...items, id];
  const publish = () => {
    if (!draft.trim()) return;
    setPosts([{ id: Date.now(), name, initials: name.slice(0, 2).toUpperCase(), location: 'Sua comunidade · Agora', text: draft.trim(), likes: 0 }, ...posts]);
    setDraft(''); setComposer(false); setTab('Comunidade');
  };
  const button = (label: string, onPress: () => void, secondary = false) => <Pressable accessibilityRole="button" onPress={onPress} style={[s.button, secondary && s.secondary]}><Text style={secondary ? s.secondaryText : s.buttonText}>{label}</Text></Pressable>;
  const heading = (eyebrow: string, title: string, subtitle: string) => <View style={s.heading}><Text style={s.eyebrow}>{eyebrow}</Text><Text style={s.title}>{title}</Text><Text style={s.muted}>{subtitle}</Text></View>;
  const postCard = (post: Post) => <View key={post.id} style={s.card}>
    <View style={s.row}><View style={s.avatar}><Text style={s.avatarText}>{post.initials}</Text></View><View style={s.grow}><Text style={s.bold}>{post.name}</Text><Text style={s.smallMuted}>{post.location}</Text></View></View>
    <Text style={s.postText}>{post.text}</Text>
    {post.distance && <View style={s.activityCard}><Text style={s.route}>╭────╮{'\n'}│  ╭─╯{'\n'}╰──╯  ●</Text><View style={s.grow}><Text style={s.eyebrow}>CORRIDA MATINAL</Text><View style={s.row}><View style={s.grow}><Text style={s.metric}>{post.distance}<Text style={s.unit}> km</Text></Text><Text style={s.smallMuted}>Distância</Text></View><View><Text style={s.metric}>{post.pace}</Text><Text style={s.smallMuted}>Ritmo /km</Text></View></View></View></View>}
    <View style={s.actions}><Pressable accessibilityRole="button" accessibilityLabel={`Curtir publicação de ${post.name}`} accessibilityState={{ selected: liked.includes(post.id) }} onPress={() => setLiked(toggle(liked, post.id))}><Text style={[s.actionText, liked.includes(post.id) && s.orange]}>{liked.includes(post.id) ? '♥' : '♡'}  {post.likes + (liked.includes(post.id) ? 1 : 0)} curtidas</Text></Pressable><Pressable accessibilityRole="button" onPress={() => Alert.alert('Comentários', 'Os comentários estarão disponíveis quando conectarmos o app ao servidor.')}><Text style={s.actionText}>↗  Conversar</Text></Pressable></View>
  </View>;
  const matchingRaces = races.filter(race => (filter === 'Todas' || race.category === filter) && `${race.name} ${race.city}`.toLocaleLowerCase('pt-BR').includes(search.toLocaleLowerCase('pt-BR')));
  return <SafeAreaProvider><SafeAreaView style={s.safe}><StatusBar style="dark" /><View style={s.header}><Text style={s.logo}>pace<Text style={s.orange}>.</Text></Text><View style={s.badge}><View style={s.dot} /><Text style={s.badgeText}>DEMONSTRAÇÃO</Text></View></View>
    <ScrollView contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
      {tab === 'Comunidade' && <>
        {heading('JUNTOS, MAIS LONGE', 'Sua próxima conexão\ncomeça na corrida.', 'Encontre pessoas que compartilham o seu ritmo.')}
        <View style={s.hero}><Text style={s.heroLabel}>O SEU PONTO DE ENCONTRO</Text><Text style={s.heroTitle}>Quilômetros viram histórias.</Text><Text style={s.heroBody}>Compartilhe um treino, celebre uma conquista e inspire quem corre com você.</Text>{button('+  Compartilhar história', () => setComposer(true))}</View>
        <View style={s.sectionRow}><Text style={s.sectionTitle}>Na comunidade</Text><Text style={s.smallMuted}>PARA VOCÊ</Text></View>
        {posts.map(postCard)}
      </>}
      {tab === 'Provas' && <>
        {heading('UM NOVO DESAFIO', 'Encontre sua\npróxima largada.', 'Provas para explorar, pessoas para conhecer.')}
        <TextInput accessibilityLabel="Buscar provas por nome ou cidade" placeholder="Buscar prova ou cidade" placeholderTextColor="#8c908c" style={s.input} value={search} onChangeText={setSearch} />
        <View style={s.filters}>{['Todas', 'Rua', 'Trilha'].map(item => <Pressable key={item} accessibilityRole="button" accessibilityState={{ selected: filter === item }} onPress={() => setFilter(item)} style={[s.chip, filter === item && s.activeChip]}><Text style={filter === item ? s.buttonText : s.secondaryText}>{item}</Text></Pressable>)}</View>
        <Text style={s.smallMuted}>EVENTOS FICTÍCIOS · NÃO ACEITAM INSCRIÇÕES</Text>
        {matchingRaces.map(race => <View style={s.card} key={race.id}><View style={s.row}><View style={s.date}><Text style={s.dateDay}>{race.day}</Text><Text style={s.eyebrow}>{race.month}</Text></View><View style={s.grow}><Text style={s.bold}>{race.name}</Text><Text style={s.muted}>{race.city}</Text><Text style={s.orange}>{race.distance}</Text></View></View><View style={s.spacer} />{button(interested.includes(race.id) ? '✓  Tenho interesse' : 'Marcar interesse', () => setInterested(toggle(interested, race.id)), !interested.includes(race.id))}</View>)}
        {!matchingRaces.length && <View style={s.card}><Text style={s.bold}>Nenhuma prova encontrada</Text><Text style={s.muted}>Tente outra cidade ou categoria.</Text></View>}
      </>}
      {tab === 'Atividade' && <>
        {heading('NO SEU RITMO', 'Cada passo\nconta.', 'Um espaço para acompanhar suas conquistas.')}
        <View style={s.hero}><Text style={s.heroLabel}>EM BREVE</Text><Text style={s.heroTitle}>Seu percurso, sua história.</Text><Text style={s.heroBody}>O registro por GPS ainda não está conectado. Esta versão não coleta nem compartilha sua localização.</Text></View>
        <View style={s.card}><Text style={s.sectionTitle}>Registro de corrida</Text><Text style={s.postText}>A próxima etapa inclui percurso, distância, ritmo e histórico de treinos, com permissões de localização e controles de privacidade.</Text>{button('Conhecer a próxima etapa', () => Alert.alert('Registro por GPS', 'Será implementado com permissões explícitas. O compartilhamento de localização será opcional e limitado às pessoas escolhidas por você.'), true)}</View>
        <View style={s.card}><Text style={s.bold}>Conectar com o Strava</Text><Text style={s.postText}>Integração planejada. Precisaremos configurar o serviço e a autorização da sua conta.</Text></View>
      </>}
      {tab === 'Perfil' && <>
        {heading('SUA HISTÓRIA', 'Muito além\ndos quilômetros.', 'Este é o seu perfil de demonstração.')}
        <View style={s.card}><View style={[s.avatar, s.bigAvatar]}><Text style={s.bigAvatarText}>{name.slice(0, 2).toUpperCase()}</Text></View><Text style={s.profileName}>{name}</Text><Text style={s.muted}>{bio}</Text><View style={s.spacer} />{button('Editar perfil', () => { setNameDraft(name); setBioDraft(bio); setProfileEditor(true); }, true)}<View style={s.stats}><View><Text style={s.metric}>{posts.length - initialPosts.length}</Text><Text style={s.smallMuted}>Publicações</Text></View><View><Text style={s.metric}>{interested.length}</Text><Text style={s.smallMuted}>Provas favoritas</Text></View></View></View>
        <Text style={s.sectionTitle}>Suas publicações</Text>{posts.slice(0, posts.length - initialPosts.length).map(postCard)}
        {posts.length === initialPosts.length && <View style={s.card}><Text style={s.bold}>Sua história começa aqui.</Text><Text style={s.postText}>Conte para a comunidade o que te faz correr.</Text>{button('Criar publicação', () => setComposer(true))}</View>}
        <Text style={s.smallMuted}>Os dados desta demonstração ficam apenas na memória e são apagados ao reiniciar. Cadastro, fotos, vídeos e seguidores ainda não estão conectados.</Text>
      </>}
      <Text style={s.footer}>FEITO PARA QUEM AMA CORRER.</Text>
    </ScrollView>
    <View style={s.navigation}>{(['Comunidade', 'Provas', 'Atividade', 'Perfil'] as Tab[]).map((item, index) => <Pressable key={item} accessibilityRole="tab" accessibilityState={{ selected: tab === item }} onPress={() => setTab(item)} style={s.navItem}><Text style={[s.navIcon, tab === item && s.orange]}>{['◎', '⚑', '↗', '○'][index]}</Text><Text style={[s.navText, tab === item && s.orange]}>{item}</Text></Pressable>)}</View>
    <Modal visible={composer || profileEditor} animationType="slide" onRequestClose={() => { setComposer(false); setProfileEditor(false); }}><SafeAreaView style={s.safe}><KeyboardAvoidingView style={s.modal} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><View style={s.sectionRow}><Text style={s.sectionTitle}>{composer ? 'Sua nova história' : 'Editar perfil'}</Text><Pressable accessibilityRole="button" onPress={() => { setComposer(false); setProfileEditor(false); }}><Text style={s.orange}>Cancelar</Text></Pressable></View>{composer ? <><Text style={s.muted}>Uma conquista, um treino ou um convite para correr.</Text><TextInput accessibilityLabel="Texto da publicação" autoFocus multiline maxLength={1000} placeholder="O que você quer compartilhar?" style={[s.input, s.textArea]} value={draft} onChangeText={setDraft} /><Text style={s.smallMuted}>{draft.length}/1000 · Publicação de demonstração</Text><Pressable accessibilityRole="button" disabled={!draft.trim()} onPress={publish} style={[s.button, !draft.trim() && s.disabled]}><Text style={s.buttonText}>Publicar</Text></Pressable></> : <><Text style={s.bold}>Nome</Text><TextInput accessibilityLabel="Nome do perfil" style={s.input} value={nameDraft} onChangeText={setNameDraft} maxLength={50} /><Text style={s.bold}>Sobre você</Text><TextInput accessibilityLabel="Biografia" style={[s.input, s.textArea]} value={bioDraft} onChangeText={setBioDraft} maxLength={200} multiline /><Pressable accessibilityRole="button" disabled={!nameDraft.trim()} style={[s.button, !nameDraft.trim() && s.disabled]} onPress={() => { setName(nameDraft.trim()); setBio(bioDraft.trim()); setProfileEditor(false); }}><Text style={s.buttonText}>Salvar perfil</Text></Pressable></>}</KeyboardAvoidingView></SafeAreaView></Modal>
  </SafeAreaView></SafeAreaProvider>;
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f8f3' },
  header: { paddingHorizontal: 24, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#e6e9df' },
  logo: { fontSize: 34, fontWeight: '900', letterSpacing: -2, color: '#203a30' }, orange: { color: '#c84c25' },
  badge: { flexDirection: 'row', gap: 6, alignItems: 'center' }, badgeText: { fontSize: 9, letterSpacing: 1, fontWeight: '700', color: '#69756b' }, dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#c84c25' },
  content: { padding: 24, gap: 18, width: '100%', maxWidth: 650, alignSelf: 'center' }, heading: { gap: 12, paddingVertical: 8 }, eyebrow: { fontSize: 10, letterSpacing: 1.8, fontWeight: '800', color: '#c84c25' }, title: { fontSize: 34, lineHeight: 39, fontWeight: '800', letterSpacing: -1.2, color: '#203a30' }, muted: { fontSize: 14, lineHeight: 22, color: '#69756b' }, smallMuted: { fontSize: 11, lineHeight: 17, color: '#69756b' },
  hero: { backgroundColor: '#203a30', padding: 24, borderRadius: 22, gap: 16 }, heroLabel: { color: '#b8c6a4', fontSize: 10, letterSpacing: 1.8, fontWeight: '700' }, heroTitle: { color: '#f7f8f3', fontSize: 27, lineHeight: 32, fontWeight: '700', letterSpacing: -.6 }, heroBody: { color: '#d3ddcf', fontSize: 14, lineHeight: 23 },
  button: { backgroundColor: '#c84c25', paddingVertical: 15, paddingHorizontal: 16, borderRadius: 12, alignItems: 'center', marginTop: 4 }, buttonText: { fontSize: 14, fontWeight: '700', color: '#fff' }, secondary: { backgroundColor: '#edf0e6' }, secondaryText: { fontSize: 14, fontWeight: '700', color: '#203a30' }, disabled: { opacity: .4 },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: 8 }, sectionTitle: { fontSize: 19, fontWeight: '700', color: '#203a30' }, card: { padding: 20, borderWidth: 1, borderColor: '#e2e6da', borderRadius: 18, backgroundColor: '#fff' }, row: { flexDirection: 'row', alignItems: 'center', gap: 12 }, grow: { flex: 1 }, avatar: { height: 42, width: 42, borderRadius: 21, backgroundColor: '#e8eddf', alignItems: 'center', justifyContent: 'center' }, avatarText: { color: '#203a30', fontWeight: '700', fontSize: 13 }, bold: { fontSize: 15, color: '#203a30', fontWeight: '700' }, postText: { fontSize: 14, lineHeight: 23, color: '#455449', marginVertical: 16 },
  activityCard: { flexDirection: 'row', alignItems: 'center', gap: 18, padding: 16, borderRadius: 12, backgroundColor: '#f1f4eb', marginBottom: 18 }, route: { fontSize: 22, lineHeight: 23, color: '#c84c25', fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace' }, metric: { fontSize: 25, color: '#203a30', fontWeight: '800', marginTop: 7 }, unit: { fontSize: 12, fontWeight: '400' }, actions: { flexDirection: 'row', justifyContent: 'space-between', gap: 12, paddingTop: 14, borderTopWidth: 1, borderColor: '#eef0e8' }, actionText: { color: '#69756b', fontSize: 12, paddingVertical: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#dce1d4', borderRadius: 12, padding: 16, fontSize: 15, color: '#203a30' }, filters: { flexDirection: 'row', gap: 8 }, chip: { paddingHorizontal: 20, paddingVertical: 12, borderRadius: 24, backgroundColor: '#edf0e6' }, activeChip: { backgroundColor: '#203a30' }, date: { borderRadius: 12, padding: 14, backgroundColor: '#f1f4eb', alignItems: 'center' }, dateDay: { fontSize: 28, fontWeight: '800', color: '#203a30' }, spacer: { height: 16 },
  bigAvatar: { height: 72, width: 72, borderRadius: 36, marginBottom: 16 }, bigAvatarText: { fontSize: 23, color: '#203a30', fontWeight: '700' }, profileName: { fontSize: 25, fontWeight: '800', color: '#203a30', marginBottom: 8 }, stats: { flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderColor: '#eef0e8', marginTop: 24, paddingTop: 12 }, footer: { textAlign: 'center', color: '#87907f', fontSize: 9, letterSpacing: 2, marginVertical: 20 },
  navigation: { flexDirection: 'row', paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#e2e6da' }, navItem: { flex: 1, alignItems: 'center', paddingVertical: 5, gap: 3 }, navIcon: { fontSize: 23, color: '#87907f' }, navText: { fontSize: 10, fontWeight: '700', color: '#69756b' }, modal: { flex: 1, padding: 24, gap: 18 }, textArea: { minHeight: 150, textAlignVertical: 'top' },
});
