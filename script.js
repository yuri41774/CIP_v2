// script.js

// 1. Configuração do Supabase
// **ATENÇÃO:** Para um ambiente de produção real, estas chaves devem ser gerenciadas
// por variáveis de ambiente (ex: process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY)
// e configuradas no seu serviço de deploy (Vercel, Netlify, etc.) para segurança.
// Para este exemplo em HTML/JS puro, elas ficam aqui.
const SUPABASE_URL = 'https://bilhtpgeclctnybjemzeg.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJpbGh0cGdlbGN0bnliamVtemVnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNzgzOTYsImV4cCI6MjA2Mzg1NDM5Nn0.yybV4HP0d9KAJGxMq7y8N_AHKgqPHNXoqu0oH_Waoh4';

const supabase = Supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', async () => { // Adicionado 'async' aqui

    // --- Funções Auxiliares para LocalStorage (REMOVIDAS OU MODIFICADAS) ---
    // Estas funções loadData e saveData NÃO SÃO MAIS NECESSÁRIAS
    // pois os dados virão diretamente do Supabase.
    // getNextId também não é mais necessário, pois o Supabase gera IDs automaticamente.

    // --- Referências Globais e Dados da Aplicação ---
    const navLinks = document.querySelectorAll('.nav-link');
    const chatButton = document.getElementById('chat-button');
    const pages = document.querySelectorAll('.page');
    const currentPageTitle = document.getElementById('current-page-title');

    const dashboardSummaryGrid = document.querySelector('.dashboard-summary-grid');
    const dashboardInsightsGrid = document.querySelector('.dashboard-insights-grid');
    const monthlyPerformanceChart = document.getElementById('monthly-performance-chart');
    const recentActivityList = document.getElementById('recent-activity-list');

    // Dados da aplicação agora serão buscados do Supabase.
    // Mantenha as variáveis aqui, mas elas serão populadas pelas funções de fetch.
    let userProfile = {}; // Será preenchido por uma função específica se houver auth
    let churches = [];
    let members = [];
    let events = [];
    let transactions = [];
    let posts = [];
    let chatMessages = []; // Para o chat, podemos simular ou usar outra tabela, simplificando com memória para este exemplo.

    // --- Referências do Perfil ---
    // Manter o perfil em localStorage ou usar autenticação Supabase é uma escolha.
    // Para simplicidade, vamos manter a lógica do perfil ainda no localStorage para este exemplo,
    // pois a autenticação exigiria mais tabelas e RLS.
    // Se quiser migrar o perfil, precisaria de uma tabela `profiles` no Supabase.
    userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
        name: "João da Silva",
        email: "joao.silva@example.com",
        phone: "(21) 98765-4321",
        address: "Rua Exemplo, 123\nBairro Centro\nRio de Janeiro - RJ"
    };

    const profileDisplay = document.getElementById('profile-display');
    const profileForm = document.getElementById('profile-form');
    const editProfileButton = document.getElementById('edit-profile-button');
    const cancelProfileEditButton = document.getElementById('cancel-profile-edit-button');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');

    // --- Referências do Chat (Manteremos em memória ou Supabase para o chat) ---
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.getElementById('chat-send-button');
    // Para o chat, podemos usar uma tabela `chat_messages` no Supabase ou manter em memória/localStorage
    // Para este exemplo, vamos manter em memória/localStorage para não adicionar mais uma tabela ao setup inicial do Supabase
    chatMessages = JSON.parse(localStorage.getItem('chatMessages')) || [
        { id: 1, sender: "João da Silva", content: "Olá a todos! Sejam bem-vindos ao chat da comunidade.", timestamp: new Date("2025-05-26T09:00:00").toISOString(), type: "sent" },
        { id: 2, sender: "Maria Oliveira", content: "Amém! Paz a todos.", timestamp: new Date("2025-05-26T09:05:00").toISOString(), type: "received" }
    ];
    let nextChatMessageId = chatMessages.length > 0 ? Math.max(...chatMessages.map(item => item.id)) + 1 : 1;


    // --- Referências de Igrejas ---
    const churchListDisplay = document.getElementById('church-list-display');
    const churchesList = document.getElementById('churches-list');
    const addChurchButton = document.getElementById('add-church-button');
    const churchForm = document.getElementById('church-form');
    const cancelChurchAddButton = document.getElementById('cancel-church-add-button');
    const churchNameInput = document.getElementById('church-name');
    const churchAddressInput = document.getElementById('church-address');
    const churchContactInput = document.getElementById('church-contact');

    // --- Referências de Membros ---
    const memberListDisplay = document.getElementById('member-list-display');
    const membersList = document.getElementById('members-list');
    const addMemberButton = document.getElementById('add-member-button');
    const memberForm = document.getElementById('member-form');
    const cancelMemberAddButton = document.getElementById('cancel-member-add-button');
    const memberNameInput = document.getElementById('member-name');
    const memberEmailInput = document.getElementById('member-email');
    const memberPhoneInput = document.getElementById('member-phone');
    const memberStatusSelect = document.getElementById('member-status');

    // --- Referências de Eventos ---
    const eventListDisplay = document.getElementById('event-list-display');
    const eventsList = document.getElementById('events-list');
    const addEventButton = document.getElementById('add-event-button');
    const eventForm = document.getElementById('event-form');
    const cancelEventAddButton = document.getElementById('cancel-event-add-button');
    const eventTitleInput = document.getElementById('event-title');
    const eventDateInput = document.getElementById('event-date');
    const eventTimeInput = document.getElementById('event-time');
    const eventLocationInput = document.getElementById('event-location');
    const eventDescriptionInput = document.getElementById('event-description');

    // --- Referências de Finanças ---
    const totalRevenueSpan = document.getElementById('total-revenue');
    const totalExpensesSpan = document.getElementById('total-expenses');
    const currentBalanceSpan = document.getElementById('current-balance');
    const transactionsList = document.getElementById('transactions-list');
    const addTransactionButton = document.getElementById('add-transaction-button');
    const transactionForm = document.getElementById('transaction-form');
    const cancelTransactionAddButton = document.getElementById('cancel-transaction-add-button');
    const transactionDescriptionInput = document.getElementById('transaction-description');
    const transactionAmountInput = document.getElementById('transaction-amount');
    const transactionTypeSelect = document.getElementById('transaction-type');
    const transactionDateInput = document.getElementById('transaction-date');

    // --- Referências de Rede Social ---
    const newPostForm = document.getElementById('new-post-form');
    const postContentInput = document.getElementById('post-content');
    const postsListContainer = document.getElementById('posts-list');


    // --- Funções de Navegação de Página ---
    async function showPage(pageData) { // Adicionado 'async'
        const pageId = pageData + '-page';

        pages.forEach(p => p.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        const activePageElement = document.getElementById(pageId);
        if (activePageElement) activePageElement.classList.add('active');

        const activeNavLink = document.querySelector(`a[data-page="${pageData}"]`);
        if (activeNavLink) activeNavLink.classList.add('active');

        const pageTitleMap = {
            'home': 'Dashboard',
            'profile': 'Meu Perfil',
            'churches': 'Igrejas Cadastradas',
            'members': 'Membros da Igreja',
            'events': 'Eventos',
            'finances': 'Controle Financeiro',
            'social': 'Mural da Comunidade',
            'chat': 'Chat da Comunidade'
        };

        if (currentPageTitle) {
            currentPageTitle.textContent = pageTitleMap[pageData] || 'Bem-vindo!';
        }

        // Lógica específica para cada página ao ser exibida
        // Agora com `await` para esperar os dados do Supabase
        if (pageData === 'home') {
            await fetchAllData(); // Busca todos os dados necessários para o dashboard
            renderDashboard();
        } else if (pageData === 'profile') {
            loadProfileData(); // Perfil ainda em localStorage para simplicidade
            toggleProfileEditMode(false);
        } else if (pageData === 'churches') {
            await fetchChurches();
            renderChurchesList();
            toggleChurchFormMode(false);
        } else if (pageData === 'members') {
            await fetchMembers();
            await fetchChurches(); // Precisa das igrejas para exibir o nome da igreja
            renderMembersList();
            toggleMemberFormMode(false);
        } else if (pageData === 'events') {
            await fetchEvents();
            renderEventsList();
            toggleEventFormMode(false);
        } else if (pageData === 'finances') {
            await fetchTransactions();
            renderFinancesSummary();
            renderTransactionsList();
            toggleTransactionFormMode(false);
        } else if (pageData === 'social') {
            await fetchPosts();
            renderPostsList();
        } else if (pageData === 'chat') {
            // Se o chat for para o Supabase, descomente a linha abaixo e crie fetchChatMessages
            // await fetchChatMessages();
            renderChatMessages(); // Chat ainda usa localStorage
        }
    }

    // --- NOVAS Funções para Interagir com Supabase ---

    // Generic fetch (para todas as tabelas)
    async function fetchData(tableName) {
        try {
            const { data, error } = await supabase
                .from(tableName)
                .select('*')
                .order('created_at', { ascending: false }); // Ordena por data de criação, mais recente primeiro

            if (error) {
                console.error(`Erro ao buscar ${tableName}:`, error.message);
                return [];
            }
            return data || [];
        } catch (e) {
            console.error(`Exceção ao buscar ${tableName}:`, e.message);
            return [];
        }
    }

    async function fetchChurches() {
        churches = await fetchData('churches');
    }

    async function fetchMembers() {
        members = await fetchData('members');
    }

    async function fetchEvents() {
        events = await fetchData('events');
    }

    async function fetchTransactions() {
        transactions = await fetchData('transactions');
    }

    async function fetchPosts() {
        posts = await fetchData('posts');
    }

    // Função para buscar todos os dados necessários para o dashboard
    async function fetchAllData() {
        await Promise.all([
            fetchChurches(),
            fetchMembers(),
            fetchEvents(),
            fetchTransactions(),
            fetchPosts()
        ]);
    }


    // --- Funções de Chat (AINDA EM LOCALSTORAGE PARA SIMPLICIDADE) ---
    function addMessage(messageText, senderName, type = 'sent') {
        const newMessage = {
            id: nextChatMessageId++,
            sender: senderName,
            content: messageText,
            timestamp: new Date().toISOString(),
            type: type
        };
        chatMessages.push(newMessage);
        localStorage.setItem('chatMessages', JSON.stringify(chatMessages)); // Salva no localStorage
        renderChatMessages();
    }

    function renderChatMessages() {
        if (!chatMessagesContainer) return;
        chatMessagesContainer.innerHTML = '';

        // Ordenar as mensagens do chat pela data/hora para exibir corretamente
        const sortedChatMessages = [...chatMessages].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

        sortedChatMessages.forEach(msg => {
            const messageElement = document.createElement('p');
            messageElement.classList.add(`message-${msg.type}`);

            const senderSpan = document.createElement('strong');
            senderSpan.textContent = `${msg.sender}:`;
            messageElement.appendChild(senderSpan);

            const messageContent = document.createTextNode(` ${msg.content}`);
            messageElement.appendChild(messageContent);

            chatMessagesContainer.appendChild(messageElement);
        });
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
    }


    // --- Funções de Perfil (AINDA EM LOCALSTORAGE) ---
    function loadProfileData() {
        const nameDisplay = document.getElementById('profile-name-display');
        const emailDisplay = document.getElementById('profile-email-display');
        const phoneDisplay = document.getElementById('profile-phone-display');
        const addressDisplay = document.getElementById('profile-address-display');

        if (nameDisplay) nameDisplay.textContent = userProfile.name;
        if (emailDisplay) email.textContent = userProfile.email;
        if (phoneDisplay) phoneDisplay.textContent = userProfile.phone;
        if (addressDisplay) addressDisplay.textContent = userProfile.address;

        if (nameInput) nameInput.value = userProfile.name;
        if (emailInput) emailInput.value = userProfile.email;
        if (phoneInput) phoneInput.value = userProfile.phone;
        if (addressInput) addressInput.value = userProfile.address;
    }

    function toggleProfileEditMode(isEditing) {
        if (profileDisplay && profileForm) {
            if (isEditing) {
                profileDisplay.classList.add('hidden');
                profileForm.classList.remove('hidden');
            } else {
                profileDisplay.classList.remove('hidden');
                profileForm.classList.add('hidden');
                loadProfileData();
            }
        }
    }

    // --- Funções de Igrejas (AGORA COM SUPABASE) ---
    async function renderChurchesList() {
        churchesList.innerHTML = '';
        if (churches.length === 0) {
            const noChurchItem = document.createElement('li');
            noChurchItem.textContent = "Nenhuma igreja cadastrada ainda.";
            churchesList.appendChild(noChurchItem);
            return;
        }

        churches.forEach(church => {
            const listItem = document.createElement('li');
            listItem.setAttribute('role', 'listitem');
            listItem.innerHTML = `
                <div class="list-item-info">
                    <h3>${church.name}</h3>
                    <p>${church.address}</p>
                    <p>Contato: ${church.contact}</p>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-secondary btn-small" data-id="${church.id}" aria-label="Editar ${church.name}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger btn-small delete-church-btn" data-id="${church.id}" aria-label="Excluir ${church.name}"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            `;
            churchesList.appendChild(listItem);
        });

        churchesList.querySelectorAll('.delete-church-btn').forEach(button => {
            button.addEventListener('click', async (e) => { // Adicionado 'async'
                const churchId = parseInt(e.target.dataset.id);
                await deleteChurch(churchId); // Adicionado 'await'
            });
        });
    }

    async function addChurch(name, address, contact) {
        try {
            const { data, error } = await supabase
                .from('churches')
                .insert([{ name, address, contact, members: 0 }]) // members: 0 é o default
                .select(); // Retorna o item inserido

            if (error) throw error;

            churches.push(data[0]); // Adiciona o item retornado à lista local
            renderChurchesList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Igreja cadastrada com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar igreja:", error.message);
            alert("Erro ao adicionar igreja: " + error.message);
        }
    }

    async function deleteChurch(id) {
        if (!confirm("Tem certeza que deseja excluir esta igreja?")) return;

        try {
            const { error } = await supabase
                .from('churches')
                .delete()
                .eq('id', id);

            if (error) throw error;

            churches = churches.filter(church => church.id !== id);
            // Também remover membros associados a esta igreja (opcional, para consistência)
            // Se você configurou Foreign Keys no Supabase, a exclusão em cascata cuidaria disso.
            // Caso contrário, você teria que fazer:
            // await supabase.from('members').delete().eq('churchId', id);
            members = members.filter(member => member.churchId !== id); // Remove localmente
            renderChurchesList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Igreja excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir igreja:", error.message);
            alert("Erro ao excluir igreja: " + error.message);
        }
    }

    function toggleChurchFormMode(isAdding) {
        if (churchListDisplay && churchForm) {
            if (isAdding) {
                churchListDisplay.classList.add('hidden');
                churchForm.classList.remove('hidden');
                churchNameInput.value = '';
                churchAddressInput.value = '';
                churchContactInput.value = '';
            } else {
                churchListDisplay.classList.remove('hidden');
                churchForm.classList.add('hidden');
                renderChurchesList();
            }
        }
    }

    // --- Funções de Membros (AGORA COM SUPABASE) ---
    async function renderMembersList() {
        membersList.innerHTML = '';
        if (members.length === 0) {
            const noMemberItem = document.createElement('li');
            noMemberItem.textContent = "Nenhum membro cadastrado ainda.";
            membersList.appendChild(noMemberItem);
            return;
        }

        members.forEach(member => {
            const listItem = document.createElement('li');
            listItem.setAttribute('role', 'listitem');
            const memberChurch = churches.find(c => c.id === member.churchId); // Busca o nome da igreja
            const churchName = memberChurch ? memberChurch.name : 'Não Atribuída';

            listItem.innerHTML = `
                <div class="list-item-info">
                    <h3>${member.name}</h3>
                    <p>Igreja: ${churchName}</p>
                    <p>E-mail: ${member.email || 'Não informado'}</p>
                    <p>Telefone: ${member.phone || 'Não informado'}</p>
                    <p>Status: ${member.status}</p>
                    <p>Entrada: ${new Date(member.created_at).toLocaleDateString('pt-BR')}</p>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-secondary btn-small" data-id="${member.id}" aria-label="Editar ${member.name}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger btn-small delete-member-btn" data-id="${member.id}" aria-label="Excluir ${member.name}"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            `;
            membersList.appendChild(listItem);
        });

        membersList.querySelectorAll('.delete-member-btn').forEach(button => {
            button.addEventListener('click', async (e) => { // Adicionado 'async'
                const memberId = parseInt(e.target.dataset.id);
                await deleteMember(memberId); // Adicionado 'await'
            });
        });
    }

    async function addMember(name, email, phone, status, churchId) { // entryDate será `created_at`
        try {
            const { data, error } = await supabase
                .from('members')
                .insert([{ name, email, phone, status, churchId: parseInt(churchId) }])
                .select();

            if (error) throw error;

            members.push(data[0]);
            renderMembersList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Membro cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar membro:", error.message);
            alert("Erro ao adicionar membro: " + error.message);
        }
    }

    async function deleteMember(id) {
        if (!confirm("Tem certeza que deseja excluir este membro?")) return;

        try {
            const { error } = await supabase
                .from('members')
                .delete()
                .eq('id', id);

            if (error) throw error;

            members = members.filter(member => member.id !== id);
            renderMembersList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Membro excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir membro:", error.message);
            alert("Erro ao excluir membro: " + error.message);
        }
    }

    function toggleMemberFormMode(isAdding) {
        if (memberListDisplay && memberForm) {
            if (isAdding) {
                memberListDisplay.classList.add('hidden');
                memberForm.classList.remove('hidden');
                memberNameInput.value = '';
                memberEmailInput.value = '';
                memberPhoneInput.value = '';
                memberStatusSelect.value = 'Ativo';
                // Popule a seleção de igrejas aqui
                const churchSelect = document.createElement('select');
                churchSelect.id = 'member-church';
                churches.forEach(church => {
                    const option = document.createElement('option');
                    option.value = church.id;
                    option.textContent = church.name;
                    churchSelect.appendChild(option);
                });
                const existingChurchSelect = memberForm.querySelector('#member-church');
                if (existingChurchSelect) {
                    existingChurchSelect.replaceWith(churchSelect);
                } else {
                    const formGroup = memberForm.querySelector('.form-group label[for="member-status"]').parentNode;
                    const churchLabel = document.createElement('label');
                    churchLabel.setAttribute('for', 'member-church');
                    churchLabel.textContent = 'Igreja:';
                    formGroup.parentNode.insertBefore(churchLabel, formGroup);
                    formGroup.parentNode.insertBefore(churchSelect, formGroup);
                }

            } else {
                memberListDisplay.classList.remove('hidden');
                memberForm.classList.add('hidden');
                renderMembersList();
            }
        }
    }

    // --- Funções de Eventos (AGORA COM SUPABASE) ---
    async function renderEventsList() {
        eventsList.innerHTML = '';
        if (events.length === 0) {
            const noEventItem = document.createElement('li');
            noEventItem.textContent = "Nenhum evento cadastrado ainda.";
            eventsList.appendChild(noEventItem);
            return;
        }

        events.forEach(event => {
            const listItem = document.createElement('li');
            listItem.setAttribute('role', 'listitem');
            listItem.innerHTML = `
                <div class="list-item-info">
                    <h3>${event.title}</h3>
                    <p>Data: ${new Date(event.date).toLocaleDateString('pt-BR')}</p>
                    <p>Hora: ${event.time || 'Não informada'}</p>
                    <p>Local: ${event.location || 'Não informado'}</p>
                    <p>Descrição: ${event.description || 'Nenhuma descrição'}</p>
                    <p>Tipo: ${event.type || 'Geral'}</p>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-secondary btn-small" data-id="${event.id}" aria-label="Editar ${event.title}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger btn-small delete-event-btn" data-id="${event.id}" aria-label="Excluir ${event.title}"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            `;
            eventsList.appendChild(listItem);
        });

        eventsList.querySelectorAll('.delete-event-btn').forEach(button => {
            button.addEventListener('click', async (e) => { // Adicionado 'async'
                const eventId = parseInt(e.target.dataset.id);
                await deleteEvent(eventId); // Adicionado 'await'
            });
        });
    }

    async function addEvent(title, date, time, location, description, type) {
        try {
            const { data, error } = await supabase
                .from('events')
                .insert([{ title, date, time, location, description, type }])
                .select();

            if (error) throw error;

            events.push(data[0]);
            renderEventsList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Evento cadastrado com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar evento:", error.message);
            alert("Erro ao adicionar evento: " + error.message);
        }
    }

    async function deleteEvent(id) {
        if (!confirm("Tem certeza que deseja excluir este evento?")) return;

        try {
            const { error } = await supabase
                .from('events')
                .delete()
                .eq('id', id);

            if (error) throw error;

            events = events.filter(event => event.id !== id);
            renderEventsList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Evento excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir evento:", error.message);
            alert("Erro ao excluir evento: " + error.message);
        }
    }

    function toggleEventFormMode(isAdding) {
        if (eventListDisplay && eventForm) {
            if (isAdding) {
                eventListDisplay.classList.add('hidden');
                eventForm.classList.remove('hidden');
                eventTitleInput.value = '';
                eventDateInput.value = '';
                eventTimeInput.value = '';
                eventLocationInput.value = '';
                eventDescriptionInput.value = '';
            } else {
                eventListDisplay.classList.remove('hidden');
                eventForm.classList.add('hidden');
                renderEventsList();
            }
        }
    }

    // --- Funções de Finanças (AGORA COM SUPABASE) ---
    function formatCurrency(value) {
        return parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function calculateFinancialSummary() {
        let totalRevenue = 0;
        let totalExpenses = 0;

        transactions.forEach(t => {
            if (t.type === 'revenue') {
                totalRevenue += parseFloat(t.amount); // Converter para número
            } else if (t.type === 'expense') {
                totalExpenses += parseFloat(t.amount);
            }
        });

        const balance = totalRevenue - totalExpenses;

        if (totalRevenueSpan) totalRevenueSpan.textContent = formatCurrency(totalRevenue);
        if (totalExpensesSpan) totalExpensesSpan.textContent = formatCurrency(totalExpenses);
        if (currentBalanceSpan) {
            currentBalanceSpan.textContent = formatCurrency(balance);
            currentBalanceSpan.classList.remove('balance-positive', 'balance-negative');
            currentBalanceSpan.classList.add(balance >= 0 ? 'finance-balance balance-positive' : 'finance-balance balance-negative');
        }
        return { totalRevenue, totalExpenses, balance };
    }

    async function renderTransactionsList() {
        transactionsList.innerHTML = '';
        if (transactions.length === 0) {
            const noTransactionItem = document.createElement('li');
            noTransactionItem.textContent = "Nenhuma transação registrada ainda.";
            transactionsList.appendChild(noTransactionItem);
            return;
        }

        // Ordenar transações por created_at (ou data), da mais recente para a mais antiga
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.created_at || b.date) - new Date(a.created_at || a.date));

        sortedTransactions.forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.setAttribute('role', 'listitem');
            const amountClass = transaction.type === 'revenue' ? 'finance-revenue' : 'finance-expense';
            const sign = transaction.type === 'revenue' ? '+' : '-';

            listItem.innerHTML = `
                <div class="transaction-info">
                    <p class="description">${transaction.description}</p>
                    <p>${new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${sign} ${formatCurrency(transaction.amount)}
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-danger btn-small delete-transaction-btn" data-id="${transaction.id}" aria-label="Excluir transação ${transaction.description}"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            `;
            transactionsList.appendChild(listItem);
        });

        transactionsList.querySelectorAll('.delete-transaction-btn').forEach(button => {
            button.addEventListener('click', async (e) => { // Adicionado 'async'
                const transactionId = parseInt(e.target.dataset.id);
                await deleteTransaction(transactionId); // Adicionado 'await'
            });
        });
    }

    async function addTransaction(description, amount, type, date) {
        try {
            const { data, error } = await supabase
                .from('transactions')
                .insert([{ description, amount: parseFloat(amount), type, date }])
                .select();

            if (error) throw error;

            transactions.push(data[0]);
            renderFinancesSummary();
            renderTransactionsList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Transação registrada com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar transação:", error.message);
            alert("Erro ao adicionar transação: " + error.message);
        }
    }

    async function deleteTransaction(id) {
        if (!confirm("Tem certeza que deseja excluir esta transação?")) return;

        try {
            const { error } = await supabase
                .from('transactions')
                .delete()
                .eq('id', id);

            if (error) throw error;

            transactions = transactions.filter(t => t.id !== id);
            renderFinancesSummary();
            renderTransactionsList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Transação excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir transação:", error.message);
            alert("Erro ao excluir transação: " + error.message);
        }
    }

    function toggleTransactionFormMode(isAdding) {
        const transactionsListDisplay = document.getElementById('transactions-list-display');
        const financesSummary = document.getElementById('finances-summary');

        if (transactionsListDisplay && financesSummary && transactionForm) {
            if (isAdding) {
                transactionsListDisplay.classList.add('hidden');
                financesSummary.classList.add('hidden');
                transactionForm.classList.remove('hidden');
                transactionDescriptionInput.value = '';
                transactionAmountInput.value = '';
                transactionTypeSelect.value = 'revenue';
                transactionDateInput.valueAsDate = new Date();
            } else {
                transactionsListDisplay.classList.remove('hidden');
                financesSummary.classList.remove('hidden');
                transactionForm.classList.add('hidden');
                renderFinancesSummary();
                renderTransactionsList();
            }
        }
    }

    // --- Funções de Rede Social (AGORA COM SUPABASE) ---
    async function renderPostsList() {
        postsListContainer.innerHTML = '<h3 class="card-title">Últimas Postagens</h3>';
        if (posts.length === 0) {
            const noPostItem = document.createElement('p');
            noPostItem.textContent = "Nenhuma postagem ainda. Seja o primeiro a compartilhar!";
            postsListContainer.appendChild(noPostItem);
            return;
        }

        // Ordenar posts por created_at, do mais recente para o mais antigo
        const sortedPosts = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        sortedPosts.forEach(post => {
            const postItem = document.createElement('div');
            postItem.classList.add('post-item');
            postItem.setAttribute('role', 'article');
            postItem.innerHTML = `
                <div class="post-header">
                    <span class="post-author">${post.author}</span>
                    <span class="post-date">${new Date(post.created_at).toLocaleString('pt-BR')}</span>
                </div>
                <p class="post-content">${post.content}</p>
                <div class="post-actions">
                    <button class="btn btn-danger btn-small delete-post-btn" data-id="${post.id}" aria-label="Excluir postagem"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            `;
            postsListContainer.appendChild(postItem);
        });

        postsListContainer.querySelectorAll('.delete-post-btn').forEach(button => {
            button.addEventListener('click', async (e) => { // Adicionado 'async'
                const postId = parseInt(e.target.dataset.id);
                await deletePost(postId); // Adicionado 'await'
            });
        });
    }

    async function addPost(author, content) {
        try {
            const { data, error } = await supabase
                .from('posts')
                .insert([{ author, content }])
                .select();

            if (error) throw error;

            posts.push(data[0]);
            renderPostsList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Postagem criada com sucesso!");
        } catch (error) {
            console.error("Erro ao adicionar post:", error.message);
            alert("Erro ao adicionar post: " + error.message);
        }
    }

    async function deletePost(id) {
        if (!confirm("Tem certeza que deseja excluir esta postagem?")) return;

        try {
            const { error } = await supabase
                .from('posts')
                .delete()
                .eq('id', id);

            if (error) throw error;

            posts = posts.filter(post => post.id !== id);
            renderPostsList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Postagem excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir post:", error.message);
            alert("Erro ao excluir post: " + error.message);
        }
    }

    // --- Funções para renderizar o Dashboard Detalhado ---

    function renderDashboard() {
        if (!dashboardSummaryGrid || !dashboardInsightsGrid || !monthlyPerformanceChart || !recentActivityList) return;

        dashboardSummaryGrid.innerHTML = '';
        dashboardInsightsGrid.innerHTML = '';
        monthlyPerformanceChart.innerHTML = '';
        recentActivityList.innerHTML = '';

        const { totalRevenue, totalExpenses, balance } = calculateFinancialSummary();

        const totalMembersCard = document.createElement('div');
        totalMembersCard.classList.add('summary-card');
        totalMembersCard.innerHTML = `
            <h4><i class="fas fa-users"></i> Total de Membros</h4>
            <span class="value">${members.length}</span>
            <p class="last-item-detail">Membros cadastrados no sistema.</p>
        `;
        dashboardSummaryGrid.appendChild(totalMembersCard);

        const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
        const nextEvent = sortedEvents.find(event => new Date(event.date) >= new Date());

        const nextEventCard = document.createElement('div');
        nextEventCard.classList.add('summary-card');
        if (nextEvent) {
            nextEventCard.innerHTML = `
                <h4><i class="fas fa-calendar-alt"></i> Próximo Evento</h4>
                <span class="value">${nextEvent.title.substring(0, 15)}...</span>
                <p class="last-item-detail">${new Date(nextEvent.date).toLocaleDateString('pt-BR')} às ${nextEvent.time}</p>
            `;
        } else {
            nextEventCard.innerHTML = `
                <h4><i class="fas fa-calendar-alt"></i> Próximo Evento</h4>
                <span class="value">Nenhum</span>
                <p class="last-item-detail">Sem eventos futuros.</p>
            `;
        }
        dashboardSummaryGrid.appendChild(nextEventCard);

        const totalChurchesCard = document.createElement('div');
        totalChurchesCard.classList.add('summary-card');
        totalChurchesCard.innerHTML = `
            <h4><i class="fas fa-church"></i> Total de Igrejas</h4>
            <span class="value">${churches.length}</span>
            <p class="last-item-detail">Igrejas gerenciadas.</p>
        `;
        dashboardSummaryGrid.appendChild(totalChurchesCard);

        const financeBalanceCard = document.createElement('div');
        financeBalanceCard.classList.add('summary-card');
        const balanceClass = balance >= 0 ? 'finance-balance balance-positive' : 'finance-balance balance-negative';
        financeBalanceCard.innerHTML = `
            <h4><i class="fas fa-money-bill-wave"></i> Saldo Financeiro</h4>
            <span class="value ${balanceClass}">${formatCurrency(balance)}</span>
            <p class="last-item-detail">Saldo atual da congregação.</p>
        `;
        dashboardSummaryGrid.appendChild(financeBalanceCard);

        const activeMembers = members.filter(m => m.status === 'Ativo').length;
        const inactiveMembers = members.filter(m => m.status === 'Inativo').length;
        const newMembers = members.filter(m => m.status === 'Novo').length;
        const memberStatusCard = document.createElement('div');
        memberStatusCard.classList.add('summary-card', 'info');
        memberStatusCard.innerHTML = `
            <h4><i class="fas fa-user-check"></i> Status de Membros</h4>
            <span class="value">${activeMembers}</span>
            <p class="last-item-detail">Ativos | ${inactiveMembers} Inativos | ${newMembers} Novos</p>
        `;
        dashboardInsightsGrid.appendChild(memberStatusCard);

        const eventTypeCounts = events.reduce((acc, event) => {
            acc[event.type] = (acc[event.type] || 0) + 1;
            return acc;
        }, {});
        const mostFrequentType = Object.keys(eventTypeCounts).length > 0 ? Object.keys(eventTypeCounts).reduce((a, b) => eventTypeCounts[a] > eventTypeCounts[b] ? a : b) : 'N/A';
        const eventTypeCard = document.createElement('div');
        eventTypeCard.classList.add('summary-card', 'warning');
        eventTypeCard.innerHTML = `
            <h4><i class="fas fa-calendar-check"></i> Eventos por Tipo</h4>
            <span class="value">${Object.keys(eventTypeCounts).length}</span>
            <p class="last-item-detail">Tipo mais comum: ${mostFrequentType}</p>
        `;
        dashboardInsightsGrid.appendChild(eventTypeCard);

        const currentMonthRevenue = transactions.filter(t => t.type === 'revenue' && new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const currentMonthExpense = transactions.filter(t => t.type === 'expense' && new Date(t.date).getMonth() === new Date().getMonth()).reduce((sum, t) => sum + parseFloat(t.amount), 0);
        const financeFlowCard = document.createElement('div');
        financeFlowCard.classList.add('summary-card', (currentMonthRevenue >= currentMonthExpense ? 'success' : 'danger'));
        financeFlowCard.innerHTML = `
            <h4><i class="fas fa-chart-pie"></i> Fluxo Mensal</h4>
            <span class="value">${formatCurrency(currentMonthRevenue - currentMonthExpense)}</span>
            <p class="last-item-detail">Receita: ${formatCurrency(currentMonthRevenue)} | Despesa: ${formatCurrency(currentMonthExpense)}</p>
        `;
        dashboardInsightsGrid.appendChild(financeFlowCard);

        const churchesWithMembers = churches.map(church => ({
            ...church,
            memberCount: members.filter(m => m.churchId === church.id).length
        })).sort((a, b) => b.memberCount - a.memberCount);
        const topChurch = churchesWithMembers.length > 0 ? churchesWithMembers[0] : null;
        const topChurchCard = document.createElement('div');
        topChurchCard.classList.add('summary-card', 'info');
        if (topChurch) {
            topChurchCard.innerHTML = `
                <h4><i class="fas fa-trophy"></i> Igreja Líder em Membros</h4>
                <span class="value">${topChurch.memberCount}</span>
                <p class="last-item-detail"><strong>${topChurch.name}</strong></p>
            `;
        } else {
            topChurchCard.innerHTML = `
                <h4><i class="fas fa-trophy"></i> Igreja Líder em Membros</h4>
                <span class="value">N/A</span>
                <p class="last-item-detail">Nenhuma igreja com membros.</p>
            `;
        }
        dashboardInsightsGrid.appendChild(topChurchCard);

        renderSimulatedChart();
        renderRecentActivity();
    }


    function renderSimulatedChart() {
        if (!monthlyPerformanceChart) return;

        monthlyPerformanceChart.innerHTML = '';

        // Obter dados reais de membros e transações para os últimos 6 meses
        const today = new Date();
        const dataPoints = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const month = date.toLocaleString('pt-BR', { month: 'short' });
            const year = date.getFullYear().toString().substring(2,4);

            const startOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
            const endOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);

            // Contagem de membros ativos no mês (simplificado para membros criados no mês)
            const membersThisMonth = members.filter(m => {
                const memberDate = new Date(m.created_at); // Use created_at
                return memberDate >= startOfMonth && memberDate <= endOfMonth;
            }).length;

            // Receita total no mês
            const revenueThisMonth = transactions.filter(t => {
                const transactionDate = new Date(t.created_at); // Use created_at
                return t.type === 'revenue' && transactionDate >= startOfMonth && transactionDate <= endOfMonth;
            }).reduce((sum, t) => sum + parseFloat(t.amount), 0);


            dataPoints.push({
                month: `${month}/${year}`,
                members: membersThisMonth,
                revenue: revenueThisMonth
            });
        }

        const maxMembers = Math.max(...dataPoints.map(d => d.members));
        const maxRevenue = Math.max(...dataPoints.map(d => d.revenue));
        // Ajuste o escalonamento para que ambos (membros e receita) caibam razoavelmente
        const maxOverall = Math.max(maxMembers, maxRevenue / 100); // Ex: R$100 de receita = 1 membro em altura

        monthlyPerformanceChart.innerHTML = `
            <div class="data-label">
                <span style="color: var(--primary-color);">Membros</span> /
                <span style="color: var(--success-color);">Receita</span>
            </div>
            <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 100%; width: 100%; padding-bottom: 5px;">
                ${dataPoints.map(d => `
                    <div class="bar-group">
                        <div class="bar members" style="height: ${Math.max(5, (d.members / (maxOverall || 1)) * 80)}%;" title="Membros: ${d.members}"></div>
                        <div class="bar revenue" style="height: ${Math.max(5, (d.revenue / (maxOverall * 100 || 1)) * 80)}%;" title="Receita: ${formatCurrency(d.revenue)}"></div>
                        <span class="bar-label">${d.month}</span>
                    </div>
                `).join('')}
            </div>
        `;
    }

    function renderRecentActivity() {
        if (!recentActivityList) return;

        recentActivityList.innerHTML = '';

        let activities = [];

        // Membros recém-adicionados (últimos 30 dias)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        members.filter(m => new Date(m.created_at) >= thirtyDaysAgo).forEach(m => {
            activities.push({
                type: 'member',
                text: `Novo membro: <strong>${m.name}</strong> (${m.status})`,
                timestamp: new Date(m.created_at)
            });
        });

        // Eventos futuros próximos (próximos 7 dias)
        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        events.filter(e => new Date(e.date) >= new Date() && new Date(e.date) <= sevenDaysFromNow).forEach(e => {
            activities.push({
                type: 'event',
                text: `Próximo evento: <strong>${e.title}</strong> em ${new Date(e.date).toLocaleDateString('pt-BR')}`,
                timestamp: new Date(e.date)
            });
        });

        // Últimas 5 transações
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);
        sortedTransactions.forEach(t => {
            const sign = t.type === 'revenue' ? '+' : '-';
            activities.push({
                type: 'finance',
                text: `${t.type === 'revenue' ? 'Receita' : 'Despesa'}: <strong>${t.description}</strong> (${sign} ${formatCurrency(t.amount)})`,
                timestamp: new Date(t.created_at)
            });
        });

        // Últimas 3 postagens
        const sortedPosts = [...posts].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 3);
        sortedPosts.forEach(p => {
            activities.push({
                type: 'social',
                text: `Postagem de <strong>${p.author}</strong>: "${p.content.substring(0, 40)}..."`,
                timestamp: new Date(p.created_at)
            });
        });

        // Últimas 3 mensagens de chat (ainda de localStorage para este exemplo)
        const sortedChatMessages = [...chatMessages].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);
        sortedChatMessages.forEach(m => {
            activities.push({
                type: 'chat',
                text: `Chat: <strong>${m.sender}</strong>: "${m.content.substring(0, 40)}..."`,
                timestamp: new Date(m.timestamp)
            });
        });


        // Ordena todas as atividades por timestamp, da mais recente para a mais antiga
        activities.sort((a, b) => b.timestamp - a.timestamp);

        const displayLimit = 10;
        const activitiesToDisplay = activities.slice(0, displayLimit);

        if (activitiesToDisplay.length === 0) {
            const noActivityItem = document.createElement('li');
            noActivityItem.textContent = "Nenhuma atividade recente para exibir.";
            recentActivityList.appendChild(noActivityItem);
            return;
        }

        activitiesToDisplay.forEach(activity => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `
                <span class="activity-text">${activity.text}</span>
                <span class="activity-timestamp">${activity.timestamp.toLocaleString('pt-BR')}</span>
            `;
            recentActivityList.appendChild(listItem);
        });
    }


    // --- Configuração de Eventos ---

    function setupNavigationEvents() {
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const pageData = e.currentTarget.dataset.page;
                showPage(pageData);
            });
        });

        if (chatButton) {
            chatButton.addEventListener('click', (e) => {
                e.preventDefault();
                const button = e.target.closest('.chat-button');
                if (button && button.dataset.page) {
                    showPage(button.dataset.page);
                }
            });
        }
    }

    function setupChatEvents() {
        if (chatSendButton && chatInput) {
            chatSendButton.addEventListener('click', () => {
                const message = chatInput.value.trim();
                if (message) {
                    addMessage(message, userProfile.name, 'sent');
                    chatInput.value = '';
                }
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    chatSendButton.click();
                }
            });
        }
    }

    function setupProfileEvents() {
        if (editProfileButton) {
            editProfileButton.addEventListener('click', () => {
                toggleProfileEditMode(true);
            });
        }

        if (cancelProfileEditButton) {
            cancelProfileEditButton.addEventListener('click', () => {
                toggleProfileEditMode(false);
            });
        }

        if (profileForm && nameInput && emailInput && phoneInput && addressInput) {
            profileForm.addEventListener('submit', (e) => {
                e.preventDefault();
                userProfile.name = nameInput.value;
                userProfile.email = emailInput.value;
                userProfile.phone = phoneInput.value;
                userProfile.address = addressInput.value;

                localStorage.setItem('userProfile', JSON.stringify(userProfile)); // Salva no localStorage

                alert("Perfil salvo com sucesso!");
                toggleProfileEditMode(false);
                if (document.getElementById('home-page').classList.contains('active')) {
                    renderDashboard();
                }
            });
        }
    }

    function setupChurchEvents() {
        if (addChurchButton) {
            addChurchButton.addEventListener('click', () => {
                toggleChurchFormMode(true);
            });
        }

        if (cancelChurchAddButton) {
            cancelChurchAddButton.addEventListener('click', () => {
                toggleChurchFormMode(false);
            });
        }

        if (churchForm) {
            churchForm.addEventListener('submit', async (e) => { // Adicionado 'async'
                e.preventDefault();
                const name = churchNameInput.value.trim();
                const address = churchAddressInput.value.trim();
                const contact = churchContactInput.value.trim();

                if (name && address) {
                    await addChurch(name, address, contact); // Adicionado 'await'
                    toggleChurchFormMode(false);
                } else {
                    alert("Por favor, preencha o nome e o endereço da igreja.");
                }
            });
        }
    }

    function setupMemberEvents() {
        if (addMemberButton) {
            addMemberButton.addEventListener('click', () => {
                toggleMemberFormMode(true);
            });
        }

        if (cancelMemberAddButton) {
            cancelMemberAddButton.addEventListener('click', () => {
                toggleMemberFormMode(false);
            });
        }

        if (memberForm) {
            memberForm.addEventListener('submit', async (e) => { // Adicionado 'async'
                e.preventDefault();
                const name = memberNameInput.value.trim();
                const email = memberEmailInput.value.trim();
                const phone = memberPhoneInput.value.trim();
                const status = memberStatusSelect.value;
                const churchId = memberForm.querySelector('#member-church').value; // Pega o ID da igreja selecionada

                if (name) {
                    await addMember(name, email, phone, status, churchId); // created_at será setado pelo Supabase
                    toggleMemberFormMode(false);
                } else {
                    alert("Por favor, preencha o nome do membro.");
                }
            });
        }
    }

    function setupEventEvents() {
        if (addEventButton) {
            addEventButton.addEventListener('click', () => {
                toggleEventFormMode(true);
            });
        }

        if (cancelEventAddButton) {
            cancelEventAddButton.addEventListener('click', () => {
                toggleEventFormMode(false);
            });
        }

        if (eventForm) {
            eventForm.addEventListener('submit', async (e) => { // Adicionado 'async'
                e.preventDefault();
                const title = eventTitleInput.value.trim();
                const date = eventDateInput.value;
                const time = eventTimeInput.value.trim();
                const location = eventLocationInput.value.trim();
                const description = eventDescriptionInput.value.trim();
                const type = "Geral";

                if (title && date) {
                    await addEvent(title, date, time, location, description, type); // Adicionado 'await'
                    toggleEventFormMode(false);
                } else {
                    alert("Por favor, preencha o título e a data do evento.");
                }
            });
        }
    }

    function setupFinanceEvents() {
        if (addTransactionButton) {
            addTransactionButton.addEventListener('click', () => {
                toggleTransactionFormMode(true);
            });
        }

        if (cancelTransactionAddButton) {
            cancelTransactionAddButton.addEventListener('click', () => {
                toggleTransactionFormMode(false);
            });
        }

        if (transactionForm) {
            transactionForm.addEventListener('submit', async (e) => { // Adicionado 'async'
                e.preventDefault();
                const description = transactionDescriptionInput.value.trim();
                const amount = transactionAmountInput.value;
                const type = transactionTypeSelect.value;
                const date = transactionDateInput.value;

                if (description && amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && date) {
                    await addTransaction(description, amount, type, date); // Adicionado 'await'
                    toggleTransactionFormMode(false);
                } else {
                    alert("Por favor, preencha todos os campos da transação corretamente (valor deve ser numérico e positivo).");
                }
            });
        }
    }

    function setupSocialEvents() {
        if (newPostForm) {
            newPostForm.addEventListener('submit', async (e) => { // Adicionado 'async'
                e.preventDefault();
                const content = postContentInput.value.trim();
                if (content) {
                    await addPost(userProfile.name, content); // Adicionado 'await'
                    postContentInput.value = '';
                } else {
                    alert("Por favor, digite algo para postar.");
                }
            });
        }
    }


    // --- Inicialização da Aplicação ---
    setupNavigationEvents();
    setupChatEvents();
    setupProfileEvents();
    setupChurchEvents();
    setupMemberEvents();
    setupEventEvents();
    setupFinanceEvents();
    setupSocialEvents();

    // Inicia a página home e busca os dados iniciais
    await showPage('home'); // Adicionado 'await'
});