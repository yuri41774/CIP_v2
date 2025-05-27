// script.js

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', () => {
    // --- Funções Auxiliares para LocalStorage ---
    function loadData(key, defaultData) {
        const storedData = localStorage.getItem(key);
        return storedData ? JSON.parse(storedData) : defaultData;
    }

    function saveData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    }

    function getNextId(arr) {
        return arr.length > 0 ? Math.max(...arr.map(item => item.id)) + 1 : 1;
    }

    // --- Referências Globais e Dados da Aplicação ---
    const navLinks = document.querySelectorAll('.nav-link');
    const chatButton = document.getElementById('chat-button');
    const pages = document.querySelectorAll('.page');
    const currentPageTitle = document.getElementById('current-page-title');

    // Referências para os novos grids do Dashboard
    const dashboardSummaryGrid = document.querySelector('.dashboard-summary-grid');
    const dashboardReportsGrid = document.querySelector('.dashboard-reports-grid');
    const monthlyPerformanceChart = document.getElementById('monthly-performance-chart');
    const recentActivityList = document.getElementById('recent-activity-list');


    // Dados carregados do localStorage ou padrão
    let userProfile = loadData('userProfile', {
        name: "João da Silva",
        email: "joao.silva@example.com",
        phone: "(21) 98765-4321",
        address: "Rua Exemplo, 123\nBairro Centro\nRio de Janeiro - RJ"
    });

    let churches = loadData('churches', [
        { id: 1, name: "Igreja da Comunidade Viva", address: "Av. Principal, 456 - Centro", contact: "(11) 2345-6789", members: 150 },
        { id: 2, name: "Assembleia de Deus Maranata", address: "Rua da Paz, 10 - Bairro Feliz", contact: "contato@admaranata.org", members: 200 },
        { id: 3, name: "Primeira Igreja Batista", address: "Praça da Fé, 78 - Cidade Nova", contact: "(21) 99887-6655", members: 100 }
    ]);
    let nextChurchId = getNextId(churches);

    let members = loadData('members', [
        { id: 1, name: "Maria Oliveira", email: "maria.o@example.com", phone: "(21) 91234-5678", status: "Ativo", churchId: 1, entryDate: "2023-01-15" },
        { id: 2, name: "Pedro Santos", email: "pedro.s@example.com", phone: "(21) 98765-4321", status: "Ativo", churchId: 2, entryDate: "2022-11-01" },
        { id: 3, name: "Ana Souza", email: "ana.s@example.com", phone: "(21) 91122-3344", status: "Novo", churchId: 1, entryDate: "2025-05-01" },
        { id: 4, name: "Lucas Costa", email: "lucas.c@example.com", phone: "(21) 95544-3322", status: "Ativo", churchId: 3, entryDate: "2024-03-10" },
        { id: 5, name: "Fernanda Lima", email: "fernanda.l@example.com", phone: "(21) 97788-9900", status: "Inativo", churchId: 2, entryDate: "2021-06-20" }
    ]);
    let nextMemberId = getNextId(members);

    let events = loadData('events', [
        { id: 1, title: "Culto de Domingo", date: "2025-06-01", time: "10:00", location: "Igreja da Comunidade Viva", description: "Culto semanal com pregação e louvor.", type: "Culto" },
        { id: 2, title: "Estudo Bíblico", date: "2025-05-29", time: "19:30", location: "Salão Comunitário", description: "Estudo aprofundado sobre o livro de Gênesis.", type: "Estudo" },
        { id: 3, title: "Ação Social - Visita ao Asilo", date: "2025-06-15", time: "09:00", location: "Asilo Recanto Feliz", description: "Arrecadação de donativos e visita aos idosos.", type: "Social" },
        { id: 4, title: "Reunião de Líderes", date: "2025-06-05", time: "20:00", location: "Secretaria da Igreja", description: "Reunião mensal de líderes.", type: "Reunião" }
    ]);
    let nextEventId = getNextId(events);

    let transactions = loadData('transactions', [
        { id: 1, description: "Dízimo de João", amount: 150.00, type: "revenue", date: "2025-05-20" },
        { id: 2, description: "Oferta da Campanha", amount: 300.00, type: "revenue", date: "2025-05-20" },
        { id: 3, description: "Conta de Luz", amount: 85.50, type: "expense", date: "2025-05-22" },
        { id: 4, description: "Material de Limpeza", amount: 45.00, type: "expense", date: "2025-05-25" },
        { id: 5, description: "Doação de Maria", amount: 50.00, type: "revenue", date: "2025-05-26" },
        { id: 6, description: "Manutenção do Templo", amount: 250.00, type: "expense", date: "2025-05-27" }
    ]);
    let nextTransactionId = getNextId(transactions);

    let posts = loadData('posts', [
        { id: 1, author: "Admin", content: "Bem-vindos à nossa nova plataforma de comunicação! 🙏", date: "2025-05-26 10:00" },
        { id: 2, author: "Maria Oliveira", content: "Agradeço a todos pela oração na semana passada, me sinto muito melhor! Deus abençoe. ✨", date: "2025-05-26 14:30" },
        { id: 3, author: "Pedro Santos", content: "Lembrete: Nosso estudo bíblico é amanhã às 19:30! Não percam! 📖", date: "2025-05-26 18:00" },
        { id: 4, author: "João da Silva", content: "Ótima iniciativa o novo Dashboard! Me ajudou a ver o total de membros rapidinho! 👍", date: "2025-05-27 15:00" }
    ]);
    let nextPostId = getNextId(posts);

    let chatMessages = loadData('chatMessages', [
        { id: 1, sender: "João da Silva", content: "Olá a todos! Sejam bem-vindos ao chat da comunidade.", timestamp: new Date("2025-05-26T09:00:00").toISOString(), type: "sent" },
        { id: 2, sender: "Maria Oliveira", content: "Amém! Paz a todos.", timestamp: new Date("2025-05-26T09:05:00").toISOString(), type: "received" },
        { id: 3, sender: "Pedro Santos", content: "Graça e paz!", timestamp: new Date("2025-05-26T09:10:00").toISOString(), type: "received" }
    ]);
    let nextChatMessageId = getNextId(chatMessages);


    // --- Referências do Perfil ---
    const profileDisplay = document.getElementById('profile-display');
    const profileForm = document.getElementById('profile-form');
    const editProfileButton = document.getElementById('edit-profile-button');
    const cancelProfileEditButton = document.getElementById('cancel-profile-edit-button');
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const addressInput = document.getElementById('address');

    // --- Referências do Chat ---
    const chatMessagesContainer = document.getElementById('chat-messages');
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.getElementById('chat-send-button');

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
    function showPage(pageData) {
        const pageId = pageData + '-page';

        pages.forEach(p => p.classList.remove('active'));
        navLinks.forEach(link => link.classList.remove('active'));

        const activePageElement = document.getElementById(pageId);
        if (activePageElement) activePageElement.classList.add('active');

        const activeNavLink = document.querySelector(`a[data-page="${pageData}"]`);
        if (activeNavLink) activeNavLink.classList.add('active');

        // Mapeia o título da página para o cabeçalho
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
        if (pageData === 'home') {
            renderDashboard(); // Renderiza o dashboard completo ao acessar a página inicial
        } else if (pageData === 'profile') {
            loadProfileData();
            toggleProfileEditMode(false);
        } else if (pageData === 'churches') {
            renderChurchesList();
            toggleChurchFormMode(false);
        } else if (pageData === 'members') {
            renderMembersList();
            toggleMemberFormMode(false);
        } else if (pageData === 'events') {
            renderEventsList();
            toggleEventFormMode(false);
        } else if (pageData === 'finances') {
            renderFinancesSummary();
            renderTransactionsList();
            toggleTransactionFormMode(false);
        } else if (pageData === 'social') {
            renderPostsList();
        } else if (pageData === 'chat') {
            renderChatMessages();
        }
    }

    // --- Funções de Chat ---
    function addMessage(messageText, senderName, type = 'sent') {
        const newMessage = {
            id: nextChatMessageId++,
            sender: senderName,
            content: messageText,
            timestamp: new Date().toISOString(),
            type: type
        };
        chatMessages.push(newMessage);
        saveData('chatMessages', chatMessages);
        renderChatMessages(); // Atualiza a lista de mensagens
    }

    function renderChatMessages() {
        if (!chatMessagesContainer) return;

        chatMessagesContainer.innerHTML = ''; // Limpa o conteúdo existente

        chatMessages.forEach(msg => {
            const messageElement = document.createElement('p');
            messageElement.classList.add(`message-${msg.type}`, 'fade-in');

            const senderSpan = document.createElement('span');
            senderSpan.textContent = `${msg.sender}:`;
            messageElement.appendChild(senderSpan);

            const messageContent = document.createTextNode(` ${msg.content}`);
            messageElement.appendChild(messageContent);

            chatMessagesContainer.appendChild(messageElement);
        });
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight; // Scroll para a última mensagem
    }

    // --- Funções de Perfil ---
    function loadProfileData() {
        // Verifica se os elementos de exibição existem antes de tentar acessá-los
        const nameDisplay = document.getElementById('profile-name-display');
        const emailDisplay = document.getElementById('profile-email-display');
        const phoneDisplay = document.getElementById('profile-phone-display');
        const addressDisplay = document.getElementById('profile-address-display');

        if (nameDisplay) nameDisplay.textContent = userProfile.name;
        if (emailDisplay) emailDisplay.textContent = userProfile.email;
        if (phoneDisplay) phoneDisplay.textContent = userProfile.phone;
        if (addressDisplay) addressDisplay.textContent = userProfile.address;

        // Preenche os inputs do formulário
        if (nameInput) nameInput.value = userProfile.name;
        if (emailInput) emailInput.value = userProfile.email;
        if (phoneInput) phoneInput.value = userProfile.phone;
        if (addressInput) addressInput.value = userProfile.address;
    }

    function toggleProfileEditMode(isEditing) {
        if (profileDisplay && profileForm) { // Garante que os elementos existam
            if (isEditing) {
                profileDisplay.classList.add('hidden');
                profileForm.classList.remove('hidden');
            } else {
                profileDisplay.classList.remove('hidden');
                profileForm.classList.add('hidden');
                loadProfileData(); // Recarrega dados para exibir os atualizados ou originais
            }
        }
    }

    // --- Funções de Igrejas ---
    function renderChurchesList() {
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
            button.addEventListener('click', (e) => {
                const churchId = parseInt(e.target.dataset.id);
                deleteChurch(churchId);
            });
        });
    }

    function addChurch(name, address, contact) {
        const newChurch = {
            id: nextChurchId++,
            name: name,
            address: address,
            contact: contact,
            members: 0 // Novo campo para o dashboard
        };
        churches.push(newChurch);
        saveData('churches', churches); // Salva no localStorage
        renderChurchesList();
        if (document.getElementById('home-page').classList.contains('active')) {
             renderDashboard(); // Atualiza o dashboard
        }
        alert("Igreja cadastrada com sucesso!");
    }

    function deleteChurch(id) {
        if (confirm("Tem certeza que deseja excluir esta igreja?")) {
            churches = churches.filter(church => church.id !== id);
            // Também remover membros associados a esta igreja (opcional, para consistência)
            members = members.filter(member => member.churchId !== id);
            saveData('churches', churches); // Salva no localStorage
            saveData('members', members); // Salva membros atualizados
            renderChurchesList();
            if (document.getElementById('home-page').classList.contains('active')) {
                 renderDashboard(); // Atualiza o dashboard
            }
            alert("Igreja excluída com sucesso!");
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

    // --- Funções de Membros ---
    function renderMembersList() {
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
            const memberChurch = churches.find(c => c.id === member.churchId);
            const churchName = memberChurch ? memberChurch.name : 'Não Atribuída';

            listItem.innerHTML = `
                <div class="list-item-info">
                    <h3>${member.name}</h3>
                    <p>Igreja: ${churchName}</p>
                    <p>E-mail: ${member.email || 'Não informado'}</p>
                    <p>Telefone: ${member.phone || 'Não informado'}</p>
                    <p>Status: ${member.status}</p>
                    <p>Entrada: ${new Date(member.entryDate).toLocaleDateString('pt-BR')}</p>
                </div>
                <div class="list-item-actions">
                    <button class="btn btn-secondary btn-small" data-id="${member.id}" aria-label="Editar ${member.name}"><i class="fas fa-edit"></i> Editar</button>
                    <button class="btn btn-danger btn-small delete-member-btn" data-id="${member.id}" aria-label="Excluir ${member.name}"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            `;
            membersList.appendChild(listItem);
        });

        membersList.querySelectorAll('.delete-member-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const memberId = parseInt(e.target.dataset.id);
                deleteMember(memberId);
            });
        });
    }

    function addMember(name, email, phone, status, churchId, entryDate) {
        const newMember = {
            id: nextMemberId++,
            name: name,
            email: email,
            phone: phone,
            status: status,
            churchId: parseInt(churchId), // Garante que seja número
            entryDate: entryDate
        };
        members.push(newMember);
        saveData('members', members); // Salva no localStorage
        renderMembersList();
        if (document.getElementById('home-page').classList.contains('active')) {
             renderDashboard(); // Atualiza o dashboard
        }
        alert("Membro cadastrado com sucesso!");
    }

    function deleteMember(id) {
        if (confirm("Tem certeza que deseja excluir este membro?")) {
            members = members.filter(member => member.id !== id);
            saveData('members', members); // Salva no localStorage
            renderMembersList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard(); // Atualiza o dashboard
            }
            alert("Membro excluído com sucesso!");
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
                // Adicionar campo de seleção de igreja e data de entrada se necessário
            } else {
                memberListDisplay.classList.remove('hidden');
                memberForm.classList.add('hidden');
                renderMembersList();
            }
        }
    }

    // --- Funções de Eventos ---
    function renderEventsList() {
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
            button.addEventListener('click', (e) => {
                const eventId = parseInt(e.target.dataset.id);
                deleteEvent(eventId);
            });
        });
    }

    function addEvent(title, date, time, location, description, type) {
        const newEvent = {
            id: nextEventId++,
            title: title,
            date: date,
            time: time,
            location: location,
            description: description,
            type: type // Novo campo para o dashboard
        };
        events.push(newEvent);
        saveData('events', events); // Salva no localStorage
        renderEventsList();
        if (document.getElementById('home-page').classList.contains('active')) {
             renderDashboard(); // Atualiza o dashboard
        }
        alert("Evento cadastrado com sucesso!");
    }

    function deleteEvent(id) {
        if (confirm("Tem certeza que deseja excluir este evento?")) {
            events = events.filter(event => event.id !== id);
            saveData('events', events); // Salva no localStorage
            renderEventsList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard(); // Atualiza o dashboard
            }
            alert("Evento excluído com sucesso!");
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

    // --- Funções de Finanças ---
    function formatCurrency(value) {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    }

    function calculateFinancialSummary() {
        let totalRevenue = 0;
        let totalExpenses = 0;

        transactions.forEach(t => {
            if (t.type === 'revenue') {
                totalRevenue += t.amount;
            } else if (t.type === 'expense') {
                totalExpenses += t.amount;
            }
        });

        const balance = totalRevenue - totalExpenses;

        if (totalRevenueSpan) totalRevenueSpan.textContent = formatCurrency(totalRevenue);
        if (totalExpensesSpan) totalExpensesSpan.textContent = formatCurrency(totalExpenses);
        if (currentBalanceSpan) {
            currentBalanceSpan.textContent = formatCurrency(balance);
            currentBalanceSpan.classList.remove('balance-positive', 'balance-negative'); // Remove classes anteriores
            currentBalanceSpan.classList.add(balance >= 0 ? 'balance-positive' : 'balance-negative');
        }
        return { totalRevenue, totalExpenses, balance }; // Retorna os valores para o dashboard
    }

    function renderTransactionsList() {
        transactionsList.innerHTML = '';
        if (transactions.length === 0) {
            const noTransactionItem = document.createElement('li');
            noTransactionItem.textContent = "Nenhuma transação registrada ainda.";
            transactionsList.appendChild(noTransactionItem);
            return;
        }

        // Ordenar transações por data, da mais recente para a mais antiga
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedTransactions.forEach(transaction => {
            const listItem = document.createElement('li');
            listItem.setAttribute('role', 'listitem');
            const amountClass = transaction.type === 'revenue' ? 'revenue' : 'expense';
            const sign = transaction.type === 'revenue' ? '+' : '-';

            listItem.innerHTML = `
                <div class="transaction-info">
                    <p class="description">${transaction.description}</p>
                    <p>${new Date(transaction.date).toLocaleDateString('pt-BR')}</p>
                </div>
                <div class="transaction-amount ${amountClass}">
                    ${sign} ${formatCurrency(transaction.amount)}
                </div>
                <div class="transaction-actions">
                    <button class="btn btn-danger btn-small delete-transaction-btn" data-id="${transaction.id}" aria-label="Excluir transação ${transaction.description}"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            `;
            transactionsList.appendChild(listItem);
        });

        transactionsList.querySelectorAll('.delete-transaction-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const transactionId = parseInt(e.target.dataset.id);
                deleteTransaction(transactionId);
            });
        });
    }

    function addTransaction(description, amount, type, date) {
        const newTransaction = {
            id: nextTransactionId++,
            description: description,
            amount: parseFloat(amount),
            type: type,
            date: date
        };
        transactions.push(newTransaction);
        saveData('transactions', transactions); // Salva no localStorage
        renderFinancesSummary();
        renderTransactionsList();
        if (document.getElementById('home-page').classList.contains('active')) {
             renderDashboard(); // Atualiza o dashboard
        }
        alert("Transação registrada com sucesso!");
    }

    function deleteTransaction(id) {
        if (confirm("Tem certeza que deseja excluir esta transação?")) {
            transactions = transactions.filter(t => t.id !== id);
            saveData('transactions', transactions); // Salva no localStorage
            renderFinancesSummary();
            renderTransactionsList();
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard(); // Atualiza o dashboard
            }
            alert("Transação excluída com sucesso!");
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

    // --- Funções de Rede Social ---
    function renderPostsList() {
        postsListContainer.innerHTML = '<h3>Últimas Postagens</h3>';
        if (posts.length === 0) {
            const noPostItem = document.createElement('p');
            noPostItem.textContent = "Nenhuma postagem ainda. Seja o primeiro a compartilhar!";
            postsListContainer.appendChild(noPostItem);
            return;
        }

        // Ordenar posts por data, do mais recente para o mais antigo
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

        sortedPosts.forEach(post => {
            const postItem = document.createElement('div');
            postItem.classList.add('post-item');
            postItem.setAttribute('role', 'article');
            postItem.innerHTML = `
                <div class="post-header">
                    <span class="post-author">${post.author}</span>
                    <span class="post-date">${new Date(post.date).toLocaleString('pt-BR')}</span>
                </div>
                <p class="post-content">${post.content}</p>
                <div class="post-actions">
                    <button class="btn btn-danger btn-small delete-post-btn" data-id="${post.id}" aria-label="Excluir postagem"><i class="fas fa-trash-alt"></i> Excluir</button>
                </div>
            `;
            postsListContainer.appendChild(postItem);
        });

        postsListContainer.querySelectorAll('.delete-post-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                const postId = parseInt(e.target.dataset.id);
                deletePost(postId);
            });
        });
    }

    function addPost(author, content) {
        const newPost = {
            id: nextPostId++,
            author: author,
            content: content,
            date: new Date().toLocaleString('pt-BR')
        };
        posts.push(newPost);
        saveData('posts', posts); // Salva no localStorage
        renderPostsList();
        // Atualiza o dashboard após nova postagem
        if (document.getElementById('home-page').classList.contains('active')) {
             renderDashboard();
        }
        alert("Postagem criada com sucesso!");
    }

    function deletePost(id) {
        if (confirm("Tem certeza que deseja excluir esta postagem?")) {
            posts = posts.filter(post => post.id !== id);
            saveData('posts', posts); // Salva no localStorage
            renderPostsList();
            // Atualiza o dashboard após exclusão de postagem
            if (document.getElementById('home-page').classList.contains('active')) {
                renderDashboard();
            }
            alert("Postagem excluída com sucesso!");
        }
    }

    // --- Funções para renderizar o Dashboard Detalhado ---

    function renderDashboard() {
        if (!dashboardSummaryGrid || !dashboardReportsGrid || !monthlyPerformanceChart || !recentActivityList) return;

        // Limpa os grids existentes
        dashboardSummaryGrid.innerHTML = '';
        dashboardReportsGrid.innerHTML = '';
        monthlyPerformanceChart.innerHTML = '';
        recentActivityList.innerHTML = '';

        // --- Seção de Resumos Principais ---
        const { totalRevenue, totalExpenses, balance } = calculateFinancialSummary(); // Obtém os valores financeiros

        // Card: Total de Membros
        const totalMembersCard = document.createElement('div');
        totalMembersCard.classList.add('summary-card');
        totalMembersCard.innerHTML = `
            <h4><i class="fas fa-users"></i> Total de Membros</h4>
            <span class="value">${members.length}</span>
        `;
        dashboardSummaryGrid.appendChild(totalMembersCard);

        // Card: Próximo Evento
        const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));
        const nextEvent = sortedEvents.find(event => new Date(event.date) >= new Date()); // Evento que ainda não passou

        const nextEventCard = document.createElement('div');
        nextEventCard.classList.add('summary-card');
        if (nextEvent) {
            nextEventCard.innerHTML = `
                <h4><i class="fas fa-calendar-alt"></i> Próximo Evento</h4>
                <span class="value">${nextEvent.title}</span>
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

        // Card: Total de Igrejas
        const totalChurchesCard = document.createElement('div');
        totalChurchesCard.classList.add('summary-card');
        totalChurchesCard.innerHTML = `
            <h4><i class="fas fa-church"></i> Total de Igrejas</h4>
            <span class="value">${churches.length}</span>
        `;
        dashboardSummaryGrid.appendChild(totalChurchesCard);

        // Card: Saldo Financeiro
        const financeBalanceCard = document.createElement('div');
        financeBalanceCard.classList.add('summary-card');
        const balanceClass = balance >= 0 ? 'balance-positive' : 'balance-negative';
        financeBalanceCard.innerHTML = `
            <h4><i class="fas fa-money-bill-wave"></i> Saldo Financeiro</h4>
            <span class="value ${balanceClass}">${formatCurrency(balance)}</span>
        `;
        dashboardSummaryGrid.appendChild(financeBalanceCard);

        // --- Seção de Relatórios e Insights (novos cards) ---

        // Card: Membros Ativos vs. Inativos
        const activeMembers = members.filter(m => m.status === 'Ativo').length;
        const inactiveMembers = members.filter(m => m.status === 'Inativo').length;
        const newMembers = members.filter(m => m.status === 'Novo').length;
        const memberStatusCard = document.createElement('div');
        memberStatusCard.classList.add('summary-card', 'info');
        memberStatusCard.innerHTML = `
            <h4><i class="fas fa-user-check"></i> Status de Membros</h4>
            <p class="value">${activeMembers} Ativos</p>
            <p class="last-item-detail">${inactiveMembers} Inativos / ${newMembers} Novos</p>
        `;
        dashboardReportsGrid.appendChild(memberStatusCard);

        // Card: Eventos Pendentes
        const pendingEvents = sortedEvents.filter(event => new Date(event.date) >= new Date()).length;
        const pendingEventsCard = document.createElement('div');
        pendingEventsCard.classList.add('summary-card', 'warning');
        pendingEventsCard.innerHTML = `
            <h4><i class="fas fa-calendar-times"></i> Eventos Pendentes</h4>
            <span class="value">${pendingEvents}</span>
            <p class="last-item-detail">Fique atento às próximas atividades.</p>
        `;
        dashboardReportsGrid.appendChild(pendingEventsCard);

        // Card: Última Transação
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
        const lastTransaction = sortedTransactions.length > 0 ? sortedTransactions[0] : null;
        const lastTransactionCard = document.createElement('div');
        lastTransactionCard.classList.add('summary-card');
        if (lastTransaction) {
            const txClass = lastTransaction.type === 'revenue' ? 'revenue' : 'expense';
            lastTransactionCard.innerHTML = `
                <h4><i class="fas fa-exchange-alt"></i> Última Transação</h4>
                <span class="value ${txClass}">${formatCurrency(lastTransaction.amount)}</span>
                <p class="last-item-detail">${lastTransaction.description}</p>
                <p class="last-item-detail">${new Date(lastTransaction.date).toLocaleDateString('pt-BR')}</p>
            `;
        } else {
            lastTransactionCard.innerHTML = `
                <h4><i class="fas fa-exchange-alt"></i> Última Transação</h4>
                <span class="value">Nenhuma</span>
                <p class="last-item-detail">Nenhuma transação recente.</p>
            `;
        }
        dashboardReportsGrid.appendChild(lastTransactionCard);

        // Card: Última Postagem (para o segundo grid também, se houver espaço)
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestPost = sortedPosts.length > 0 ? sortedPosts[0] : null;
        const latestPostCard = document.createElement('div');
        latestPostCard.classList.add('summary-card', 'success');
        if (latestPost) {
            latestPostCard.innerHTML = `
                <h4><i class="fas fa-share-alt"></i> Última Postagem</h4>
                <span class="value">${latestPost.author}</span>
                <p class="last-item-detail">${latestPost.content.substring(0, 50)}...</p>
                <p class="last-item-detail">${new Date(latestPost.date).toLocaleDateString('pt-BR')}</p>
            `;
        } else {
            latestPostCard.innerHTML = `
                <h4><i class="fas fa-share-alt"></i> Última Postagem</h4>
                <span class="value">Nenhuma</span>
                <p class="last-item-detail">Nenhuma postagem ainda.</p>
            `;
        }
        dashboardReportsGrid.appendChild(latestPostCard);


        // --- Seção de Gráfico Simulados ---
        renderSimulatedChart();


        // --- Seção de Atividades Recentes ---
        renderRecentActivity();
    }


    function renderSimulatedChart() {
        if (!monthlyPerformanceChart) return;

        monthlyPerformanceChart.innerHTML = ''; // Limpa o conteúdo

        // Simulação de dados para os últimos 6 meses (valores de exemplo)
        const today = new Date();
        const dataPoints = [];
        for (let i = 5; i >= 0; i--) {
            const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
            const month = date.toLocaleString('pt-BR', { month: 'short' });
            const year = date.getFullYear().toString().substring(2,4);

            // Valores simulados (você pode ajustar a lógica aqui)
            const simulatedMembers = 100 + (i * 10) + Math.floor(Math.random() * 15);
            const simulatedRevenue = 1000 + (i * 200) + Math.floor(Math.random() * 300);

            dataPoints.push({
                month: `${month}/${year}`,
                members: simulatedMembers,
                revenue: simulatedRevenue
            });
        }

        monthlyPerformanceChart.innerHTML = `
            <p><strong>Membros:</strong> ${dataPoints.map(d => `${d.members}`).join(' - ')}</p>
            <p><strong>Receita:</strong> ${dataPoints.map(d => `${formatCurrency(d.revenue)}`).join(' - ')}</p>
            <div style="display: flex; justify-content: space-around; align-items: flex-end; height: 150px; border-bottom: 1px solid var(--text-light); padding-bottom: 5px; width: 100%;">
                ${dataPoints.map(d => `
                    <div style="display: flex; flex-direction: column; align-items: center;">
                        <div class="bar" style="height: ${d.members / 2}px; background-color: var(--primary-color);" title="Membros: ${d.members}"></div>
                        <div class="bar" style="height: ${d.revenue / 200}px; background-color: var(--success-color);" title="Receita: ${formatCurrency(d.revenue)}"></div>
                        <small style="font-size: 0.7em; color: var(--text-light); margin-top: 5px;">${d.month}</small>
                    </div>
                `).join('')}
            </div>
        `;
    }


    function renderRecentActivity() {
        if (!recentActivityList) return;

        recentActivityList.innerHTML = ''; // Limpa o conteúdo

        // Coleta todas as atividades recentes dos diferentes módulos
        let activities = [];

        // Membros recém-adicionados (últimos 30 dias)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        members.filter(m => new Date(m.entryDate) >= thirtyDaysAgo).forEach(m => {
            activities.push({
                type: 'member',
                text: `Novo membro: <strong>${m.name}</strong> (${m.status})`,
                timestamp: new Date(m.entryDate)
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
        const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);
        sortedTransactions.forEach(t => {
            const sign = t.type === 'revenue' ? '+' : '-';
            activities.push({
                type: 'finance',
                text: `${t.type === 'revenue' ? 'Receita' : 'Despesa'}: <strong>${t.description}</strong> (${sign} ${formatCurrency(t.amount)})`,
                timestamp: new Date(t.date)
            });
        });

        // Últimas 3 postagens
        const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 3);
        sortedPosts.forEach(p => {
            activities.push({
                type: 'social',
                text: `Postagem de <strong>${p.author}</strong>: "${p.content.substring(0, 40)}..."`,
                timestamp: new Date(p.date)
            });
        });

        // Últimas 3 mensagens de chat
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

        // Limita a um número razoável de atividades para não sobrecarregar
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
                    addMessage(message, userProfile.name, 'sent'); // Usa o nome do usuário logado
                    chatInput.value = '';
                }
            });

            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault(); // Impede a quebra de linha no input
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

                saveData('userProfile', userProfile); // Salva no localStorage

                alert("Perfil salvo com sucesso!");
                toggleProfileEditMode(false);
                // Atualiza o dashboard se a página inicial estiver ativa
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
            churchForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = churchNameInput.value.trim();
                const address = churchAddressInput.value.trim();
                const contact = churchContactInput.value.trim();

                if (name && address) {
                    addChurch(name, address, contact);
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
            memberForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const name = memberNameInput.value.trim();
                const email = memberEmailInput.value.trim();
                const phone = memberPhoneInput.value.trim();
                const status = memberStatusSelect.value;
                const churchId = churches[0] ? churches[0].id : 0; // Atribui à primeira igreja ou 0 se não houver
                const entryDate = new Date().toISOString().split('T')[0]; // Data de hoje

                if (name) {
                    addMember(name, email, phone, status, churchId, entryDate);
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
            eventForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const title = eventTitleInput.value.trim();
                const date = eventDateInput.value;
                const time = eventTimeInput.value.trim();
                const location = eventLocationInput.value.trim();
                const description = eventDescriptionInput.value.trim();
                const type = "Geral"; // Adicionado tipo padrão

                if (title && date) {
                    addEvent(title, date, time, location, description, type);
                    toggleEventFormMode(false);
                } else {
                    alert("Por favor, preencha o título e a data do evento.");
                }
            });
        }
    }

    // Configuração de Eventos de Finanças
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
            transactionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const description = transactionDescriptionInput.value.trim();
                const amount = transactionAmountInput.value;
                const type = transactionTypeSelect.value;
                const date = transactionDateInput.value;

                if (description && amount && !isNaN(parseFloat(amount)) && parseFloat(amount) > 0 && date) {
                    addTransaction(description, amount, type, date);
                    toggleTransactionFormMode(false);
                } else {
                    alert("Por favor, preencha todos os campos da transação corretamente (valor deve ser numérico e positivo).");
                }
            });
        }
    }

    // Configuração de Eventos de Rede Social
    function setupSocialEvents() {
        if (newPostForm) {
            newPostForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const content = postContentInput.value.trim();
                if (content) {
                    addPost(userProfile.name, content);
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
    showPage('home'); // Define a página inicial ao carregar
});