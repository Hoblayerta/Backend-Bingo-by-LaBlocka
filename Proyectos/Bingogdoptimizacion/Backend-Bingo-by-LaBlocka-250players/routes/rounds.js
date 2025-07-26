const express = require('express');
const router = express.Router();
const emailUtils = require('../utils/email');

// Simulación de una lista de partidas/sesiones
let rounds = [];

// ACTUALIZADO: 60 tableros predefinidos únicos de 3x3 - Solo primeros 50 disponibles para juego
const SIXTY_PREDEFINED_BOARDS = [
    // Tableros 1-10 (Originales mejorados)
    [[12, 6, 10], [5, 2, 18], [24, 16, 1]],      // Tablero 1
    [[9, 8, 17], [23, 20, 7], [15, 4, 14]],      // Tablero 2  
    [[5, 22, 19], [13, 12, 11], [21, 3, 1]],     // Tablero 3
    [[10, 7, 14], [1, 23, 16], [21, 8, 17]],     // Tablero 4
    [[13, 20, 18], [15, 11, 2], [9, 5, 6]],      // Tablero 5
    [[4, 13, 16], [3, 8, 12], [19, 21, 20]],     // Tablero 6
    [[5, 18, 10], [11, 7, 22], [19, 14, 15]],    // Tablero 7
    [[3, 17, 2], [9, 6, 12], [20, 21, 24]],      // Tablero 8
    [[7, 5, 18], [16, 17, 15], [14, 13, 1]],     // Tablero 9
    [[15, 8, 3], [19, 11, 6], [24, 4, 22]],      // Tablero 10

    // Tableros 11-20 (Distribución balanceada)
    [[1, 14, 23], [8, 15, 4], [22, 9, 17]],      // Tablero 11
    [[24, 3, 11], [6, 19, 13], [2, 16, 7]],      // Tablero 12
    [[18, 20, 5], [10, 1, 14], [23, 12, 8]],     // Tablero 13
    [[4, 17, 21], [15, 24, 3], [11, 6, 19]],     // Tablero 14
    [[13, 2, 16], [7, 18, 20], [5, 10, 1]],      // Tablero 15
    [[14, 23, 12], [8, 4, 17], [21, 15, 24]],    // Tablero 16
    [[3, 11, 6], [19, 13, 2], [16, 7, 18]],      // Tablero 17
    [[20, 5, 10], [1, 14, 23], [12, 8, 4]],      // Tablero 18
    [[17, 21, 15], [24, 3, 11], [6, 19, 13]],    // Tablero 19
    [[2, 16, 7], [18, 20, 5], [10, 1, 14]],      // Tablero 20

    // Tableros 21-30 (Patrones diagonales)
    [[22, 11, 4], [9, 16, 24], [3, 21, 8]],      // Tablero 21
    [[15, 7, 19], [12, 5, 14], [6, 23, 1]],      // Tablero 22
    [[18, 2, 13], [20, 17, 10], [24, 9, 15]],    // Tablero 23
    [[8, 22, 6], [14, 3, 19], [11, 16, 4]],      // Tablero 24
    [[21, 12, 24], [7, 15, 1], [18, 5, 13]],     // Tablero 25
    [[9, 19, 2], [23, 8, 17], [4, 20, 11]],      // Tablero 26
    [[16, 6, 21], [1, 22, 14], [15, 10, 3]],     // Tablero 27
    [[24, 13, 7], [5, 18, 12], [19, 2, 23]],     // Tablero 28
    [[4, 17, 9], [20, 11, 6], [8, 24, 16]],      // Tablero 29
    [[14, 1, 22], [3, 15, 19], [13, 7, 5]],      // Tablero 30

    // Tableros 31-40 (Distribución por rangos)
    [[1, 9, 17], [2, 10, 18], [3, 11, 19]],      // Tablero 31
    [[4, 12, 20], [5, 13, 21], [6, 14, 22]],     // Tablero 32
    [[7, 15, 23], [8, 16, 24], [1, 4, 7]],       // Tablero 33
    [[2, 5, 8], [3, 6, 9], [10, 13, 16]],        // Tablero 34
    [[11, 14, 17], [12, 15, 18], [19, 22, 1]],   // Tablero 35
    [[20, 23, 2], [21, 24, 3], [4, 7, 10]],      // Tablero 36
    [[5, 8, 11], [6, 9, 12], [13, 16, 19]],      // Tablero 37
    [[14, 17, 20], [15, 18, 21], [22, 1, 4]],    // Tablero 38
    [[23, 2, 5], [24, 3, 6], [7, 10, 13]],       // Tablero 39
    [[8, 11, 14], [9, 12, 15], [16, 19, 22]],    // Tablero 40

    // Tableros 41-50 (Patrones mixtos - Disponibles para juego)
    [[17, 20, 23], [18, 21, 24], [1, 3, 5]],     // Tablero 41
    [[2, 4, 6], [7, 9, 11], [8, 10, 12]],        // Tablero 42
    [[13, 15, 17], [14, 16, 18], [19, 21, 23]],  // Tablero 43
    [[20, 22, 24], [1, 5, 9], [2, 6, 10]],       // Tablero 44
    [[3, 7, 11], [4, 8, 12], [13, 17, 21]],      // Tablero 45
    [[14, 18, 22], [15, 19, 23], [16, 20, 24]],  // Tablero 46
    [[1, 6, 11], [2, 7, 12], [3, 8, 13]],        // Tablero 47
    [[4, 9, 14], [5, 10, 15], [16, 21, 2]],      // Tablero 48
    [[17, 22, 3], [18, 23, 4], [19, 24, 5]],     // Tablero 49
    [[20, 1, 6], [7, 12, 17], [8, 13, 18]],      // Tablero 50

    // Tableros 51-60 (Backup - Reservados para expansión futura)
    [[9, 14, 19], [10, 15, 20], [11, 16, 21]],   // Tablero 51 (Backup)
    [[22, 3, 8], [23, 4, 9], [24, 5, 10]],       // Tablero 52 (Backup)
    [[1, 11, 21], [2, 12, 22], [3, 13, 23]],     // Tablero 53 (Backup)
    [[4, 14, 24], [5, 15, 1], [6, 16, 2]],       // Tablero 54 (Backup)
    [[7, 17, 3], [8, 18, 4], [9, 19, 5]],        // Tablero 55 (Backup)
    [[10, 20, 6], [11, 21, 7], [12, 22, 8]],     // Tablero 56 (Backup)
    [[13, 23, 9], [14, 24, 10], [15, 1, 11]],    // Tablero 57 (Backup)
    [[16, 2, 12], [17, 3, 13], [18, 4, 14]],     // Tablero 58 (Backup)
    [[19, 5, 15], [20, 6, 16], [21, 7, 17]],     // Tablero 59 (Backup)
    [[22, 8, 18], [23, 9, 19], [24, 10, 20]]     // Tablero 60 (Backup)
];

// FUNCIÓN: Verificar unicidad de tableros
function verifyBoardUniqueness() {
    const uniqueBoards = new Set();
    const duplicates = [];
    
    SIXTY_PREDEFINED_BOARDS.forEach((board, index) => {
        const boardString = JSON.stringify(board.flat().sort());
        if (uniqueBoards.has(boardString)) {
            duplicates.push({
                boardIndex: index + 1,
                duplicateOf: Array.from(uniqueBoards).indexOf(boardString) + 1
            });
        } else {
            uniqueBoards.add(boardString);
        }
    });
    
    if (duplicates.length > 0) {
        console.log('⚠️ TABLEROS DUPLICADOS DETECTADOS:', duplicates);
    } else {
        console.log('✅ Todos los 60 tableros son únicos');
    }
    
    return duplicates.length === 0;
}

// FUNCIÓN: Analizar distribución de números
function analyzeBoardDistribution() {
    const numberFrequency = {};
    
    // Inicializar contador para cada número 1-24
    for (let i = 1; i <= 24; i++) {
        numberFrequency[i] = 0;
    }
    
    // Contar frecuencia de cada número
    SIXTY_PREDEFINED_BOARDS.forEach(board => {
        board.flat().forEach(number => {
            if (number >= 1 && number <= 24) {
                numberFrequency[number]++;
            }
        });
    });
    
    const frequencies = Object.values(numberFrequency);
    const avgFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
    const minFrequency = Math.min(...frequencies);
    const maxFrequency = Math.max(...frequencies);
    const variance = maxFrequency - minFrequency;
    
    console.log('📊 Distribución de números en 60 tableros:');
    console.log('  - Frecuencia promedio:', avgFrequency.toFixed(2));
    console.log('  - Frecuencia mínima:', minFrequency);
    console.log('  - Frecuencia máxima:', maxFrequency);
    console.log('  - Varianza:', variance);
    console.log('  - Distribución balanceada:', variance <= 15 ? '✅' : '❌');
    
    return {
        avgFrequency,
        minFrequency,
        maxFrequency,
        variance,
        isBalanced: variance <= 15,
        numberFrequency
    };
}

// Ejecutar verificaciones al cargar el módulo
console.log('🔍 Verificando sistema de 60 tableros...');
verifyBoardUniqueness();
analyzeBoardDistribution();

// CORREGIDO: Configuración de límites para 50 tableros
const MAX_PLAYERS_DEFAULT = 50;  // CORREGIDO: 50 por defecto (no 10)
const MAX_PLAYERS_TOTAL = 60;    // Límite absoluto por si se habilitan tableros backup
const AVAILABLE_BOARDS_COUNT = 50;  // CORREGIDO: 50 tableros disponibles para juego
const TOTAL_BOARDS_COUNT = 60;   // Total de tableros diseñados

// CORREGIR en routes/rounds.js - Endpoint /create
router.post('/create', async (req, res) => {
    try {
        const { 
            code, 
            hostEmail, 
            hostPassword, 
            maxPlayers = MAX_PLAYERS_DEFAULT,  // 50 por defecto
            maxWinners = 999 
        } = req.body;
        
        console.log(`🎯 Creando partida: ${code} para ${hostEmail} (Máximo ${maxPlayers} jugadores)`);
        
        // Validaciones existentes...
        if (!code) {
            return res.status(400).json({ error: 'Código de partida es requerido' });
        }
        
        if (!/^[A-Z0-9]{6}$/.test(code)) {
            return res.status(400).json({ error: 'El código debe tener exactamente 6 caracteres alfanuméricos' });
        }
        
        if (rounds.some(r => r.code === code)) {
            return res.status(400).json({ error: 'El código de la partida ya existe' });
        }
        
        if (!hostEmail) {
            return res.status(400).json({ error: 'Email del host es requerido' });
        }
        
        const existingRound = rounds.find(r => r.hostEmail === hostEmail && r.status !== 'finished');
        if (existingRound) {
            return res.status(400).json({ error: 'Ya tienes una partida activa' });
        }
        
        // CORREGIDO: Asegurar que el límite sea realmente 50
        const requestedMaxPlayers = Math.min(maxPlayers, AVAILABLE_BOARDS_COUNT); // 50
        if (requestedMaxPlayers !== maxPlayers && maxPlayers <= AVAILABLE_BOARDS_COUNT) {
            console.log(`⚠️ Límite de jugadores ajustado de ${maxPlayers} a ${requestedMaxPlayers}`);
        }
        
        console.log(`📊 CONFIGURACIÓN DE PARTIDA:`);
        console.log(`  - MAX_PLAYERS_DEFAULT: ${MAX_PLAYERS_DEFAULT}`);
        console.log(`  - AVAILABLE_BOARDS_COUNT: ${AVAILABLE_BOARDS_COUNT}`);
        console.log(`  - requestedMaxPlayers: ${requestedMaxPlayers}`);
        console.log(`  - Rango válido de tableros: 0-${AVAILABLE_BOARDS_COUNT - 1}`);
        
        const newRound = {
            code: code,
            hostEmail: hostEmail,
            createdAt: new Date(),
            status: 'waiting',
            maxPlayers: requestedMaxPlayers,  // Debe ser 50
            players: [],
            host: {
                email: hostEmail,
                joinedAt: new Date()
            },
            boards: SIXTY_PREDEFINED_BOARDS.slice(0, AVAILABLE_BOARDS_COUNT), // 50 tableros
            totalBoardsDesigned: TOTAL_BOARDS_COUNT,    // 60
            availableBoardsCount: AVAILABLE_BOARDS_COUNT, // 50
            takenBoards: [],
            calledNumbers: [],
            currentNumber: null,
            winners: [],
            maxWinners: 999,
            winnerCount: 0,
            allowMultipleWinners: true,
            gameFinishedTime: null,
            autoEndOnWinners: false,
            lastCardTime: null,
            cardHistory: [],
            totalCardsAvailable: 24,
            gameStartTime: null,
            gameState: 'lobby',
            triggerSent: false,
            triggerTime: null,
            // NUEVO: Campo para cartas barajeadas del host
            shuffledCards: [],
            shuffleTimestamp: null
        };
        
        rounds.push(newRound);
        
        // Enviar código por email al host
        if (hostPassword) {
            try {
                emailUtils.sendRoundCodeEmail(hostEmail, code, hostPassword);
            } catch (emailError) {
                console.log(`⚠️ Error enviando email (no crítico): ${emailError.message}`);
            }
        }
        
        console.log(`✅ Partida creada: ${code} por ${hostEmail}`);
        console.log(`📊 Configuración final: ${newRound.maxPlayers} jugadores máximo, ${newRound.boards.length} tableros disponibles`);
        console.log(`📋 Rango de tableros: 0-${newRound.boards.length - 1} (Tableros 1-${newRound.boards.length})`);
        
        res.json({ 
            success: true, 
            message: 'Partida creada correctamente',
            code: code,
            roundId: rounds.length - 1,
            maxPlayers: newRound.maxPlayers,
            maxWinners: newRound.maxWinners,
            autoEndOnWinners: newRound.autoEndOnWinners,
            boards: newRound.boards.length,
            totalBoardsDesigned: newRound.totalBoardsDesigned,
            availableBoardsCount: newRound.availableBoardsCount
        });
        
    } catch (error) {
        console.error('❌ Error creating round:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/list', (req, res) => {
    try {
        const safeRounds = rounds.map(r => ({
            code: r.code,
            createdAt: r.createdAt,
            status: r.status,
            playerCount: r.players.length,
            maxPlayers: r.maxPlayers,
            gameState: r.gameState,
            hostEmail: r.hostEmail,
            winners: r.winners || [],
            winnerCount: r.winners ? r.winners.length : 0,
            maxWinners: r.maxWinners || 999,
            autoEndOnWinners: r.autoEndOnWinners || false,
            totalCalled: r.calledNumbers ? r.calledNumbers.length : 0,
            currentNumber: r.currentNumber || null,
            // NUEVO: Información de tableros
            availableBoardsCount: r.availableBoardsCount || AVAILABLE_BOARDS_COUNT,
            totalBoardsDesigned: r.totalBoardsDesigned || TOTAL_BOARDS_COUNT
        }));
        res.json(safeRounds);
    } catch (error) {
        console.error('❌ Error listing rounds:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// CORREGIDO: Endpoint que incluye calledNumbers para el GamePlayerScene
router.get('/:code', (req, res) => {
    try {
        const { code } = req.params;
        const round = rounds.find(r => r.code === code);
        
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        // CRÍTICO: Incluir calledNumbers para que GamePlayerScene pueda validar cartas
        res.json({
            code: round.code,
            status: round.status,
            gameState: round.gameState,
            createdAt: round.createdAt,
            playerCount: round.players.length,
            maxPlayers: round.maxPlayers,
            players: round.players.map(p => ({ 
                name: p.name, 
                joinedAt: p.joinedAt, 
                boardIndex: p.boardIndex 
            })),
            hostEmail: round.hostEmail,
            takenBoards: round.takenBoards,
            winners: round.winners || [],
            winnerCount: round.winners ? round.winners.length : 0,
            maxWinners: round.maxWinners || 999,
            autoEndOnWinners: round.autoEndOnWinners || false,
            totalCalled: round.calledNumbers ? round.calledNumbers.length : 0,
            currentNumber: round.currentNumber || null,
            
            // NUEVO: Incluir cartas llamadas para validación en GamePlayerScene
            calledNumbers: round.calledNumbers || [],
            
            // NUEVO: Incluir cartas barajeadas del host
            shuffledCards: round.shuffledCards || [],
            shuffleTimestamp: round.shuffleTimestamp || null,
            
            // Información de tableros
            availableBoardsCount: round.availableBoardsCount || AVAILABLE_BOARDS_COUNT,
            totalBoardsDesigned: round.totalBoardsDesigned || TOTAL_BOARDS_COUNT,
            boardsInUse: round.takenBoards.length,
            boardsAvailable: (round.availableBoardsCount || AVAILABLE_BOARDS_COUNT) - round.takenBoards.length
        });
    } catch (error) {
        console.error('❌ Error getting round:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// CORREGIR en routes/rounds.js - Endpoint /join con límites correctos
router.post('/:code/join', (req, res) => {
    try {
        const { code } = req.params;
        const { playerName, playerEmail, selectedBoardIndex } = req.body;
        
        console.log(`🎯 JOIN REQUEST: Player=${playerName}, RequestedBoard=${selectedBoardIndex}`);
        
        if (!playerName) {
            return res.status(400).json({ error: 'Nombre del jugador es requerido' });
        }
        
        const round = rounds.find(r => r.code === code);
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        if (round.status === 'finished') {
            return res.status(400).json({ error: 'La partida ya ha terminado' });
        }
        
        if (round.players.length >= round.maxPlayers) {
            return res.status(400).json({ 
                error: `La partida está llena (${round.players.length}/${round.maxPlayers})` 
            });
        }
        
        if (round.players.some(p => p.name === playerName)) {
            return res.status(400).json({ error: 'El nombre del jugador ya está en uso' });
        }
        
        // CORREGIDO: Usar límites correctos para 50 tableros
        const actualAvailableBoards = round.availableBoardsCount || AVAILABLE_BOARDS_COUNT; // 50
        const maxBoardIndex = Math.min(actualAvailableBoards - 1, round.maxPlayers - 1); // 49
        
        console.log(`📊 LÍMITES DE TABLEROS:`);
        console.log(`  - actualAvailableBoards: ${actualAvailableBoards}`);
        console.log(`  - round.maxPlayers: ${round.maxPlayers}`);
        console.log(`  - maxBoardIndex: ${maxBoardIndex}`);
        console.log(`  - Rango válido: 0-${maxBoardIndex} (Tableros 1-${maxBoardIndex + 1})`);
        
        let boardIndex = selectedBoardIndex;
        
        // CASO 1: No se especificó tablero
        if (boardIndex === undefined || boardIndex === null) {
            console.log(`⚠️ No se especificó tablero, asignando automáticamente`);
            boardIndex = findFirstAvailableBoard(round.takenBoards, maxBoardIndex);
            if (boardIndex === -1) {
                return res.status(400).json({ 
                    error: 'No hay tableros disponibles',
                    availableBoards: 0,
                    maxBoardIndex: maxBoardIndex,
                    totalBoards: actualAvailableBoards
                });
            }
            console.log(`📋 Tablero asignado automáticamente: ${boardIndex} (Tablero ${boardIndex + 1})`);
        }
        // CASO 2: Tablero específico solicitado
        else {
            console.log(`🎯 Tablero específico solicitado: ${boardIndex} (Tablero ${boardIndex + 1})`);
            
            // CORREGIDO: Validar rango con límite de 50
            if (boardIndex < 0 || boardIndex > maxBoardIndex) {
                console.log(`❌ ÍNDICE FUERA DE RANGO:`);
                console.log(`  - Solicitado: ${boardIndex}`);
                console.log(`  - Rango válido: 0-${maxBoardIndex}`);
                console.log(`  - Tableros disponibles: ${actualAvailableBoards}`);
                
                return res.status(400).json({ 
                    error: `Índice de tablero inválido (0-${maxBoardIndex})`,
                    requestedIndex: boardIndex,
                    maxBoardIndex: maxBoardIndex,
                    validRange: `0-${maxBoardIndex}`,
                    totalBoardsAvailable: actualAvailableBoards,
                    boardNumbers: `1-${maxBoardIndex + 1}`,
                    detailedError: `El tablero ${boardIndex + 1} no existe. Tableros disponibles: 1-${maxBoardIndex + 1}`
                });
            }
            
            // Verificar si está ocupado
            if (round.takenBoards.includes(boardIndex)) {
                console.log(`❌ Tablero ${boardIndex} YA ESTÁ OCUPADO`);
                console.log(`📊 Tableros ocupados: [${round.takenBoards.join(', ')}]`);
                
                // Ofrecer tableros alternativos
                const availableBoards = [];
                for (let i = 0; i <= maxBoardIndex; i++) {
                    if (!round.takenBoards.includes(i)) {
                        availableBoards.push(i);
                    }
                }
                
                return res.status(400).json({ 
                    error: `El tablero ${boardIndex + 1} ya está ocupado`,
                    requestedBoardIndex: boardIndex,
                    requestedBoardNumber: boardIndex + 1,
                    takenBoards: round.takenBoards,
                    availableBoards: availableBoards,
                    availableBoardNumbers: availableBoards.map(i => i + 1),
                    suggestion: availableBoards.length > 0 ? 
                        `Tableros disponibles: ${availableBoards.map(i => i + 1).join(', ')}` : 
                        'No hay tableros disponibles',
                    totalBoardsSystem: actualAvailableBoards
                });
            }
            
            console.log(`✅ Tablero ${boardIndex} (Tablero ${boardIndex + 1}) disponible`);
        }
        
        // Validación final
        if (boardIndex < 0 || boardIndex > maxBoardIndex || round.takenBoards.includes(boardIndex)) {
            console.error(`❌ ERROR CRÍTICO: boardIndex inválido después de validación: ${boardIndex}`);
            return res.status(500).json({ 
                error: 'Error interno en asignación de tablero',
                debugInfo: {
                    boardIndex: boardIndex,
                    maxBoardIndex: maxBoardIndex,
                    takenBoards: round.takenBoards,
                    totalBoards: actualAvailableBoards
                }
            });
        }
        
        const playerBoard = round.boards[boardIndex];
        
        const newPlayer = {
            name: playerName,
            email: playerEmail || null,
            joinedAt: new Date(),
            board: playerBoard,
            markedNumbers: [],
            boardIndex: boardIndex
        };
        
        round.players.push(newPlayer);
        round.takenBoards.push(boardIndex);
        
        console.log(`✅ JUGADOR AGREGADO EXITOSAMENTE:`);
        console.log(`   - Nombre: ${playerName}`);
        console.log(`   - Tablero solicitado: ${selectedBoardIndex} (Tablero ${(selectedBoardIndex || 0) + 1})`);
        console.log(`   - Tablero asignado: ${boardIndex} (Tablero ${boardIndex + 1})`);
        console.log(`   - Tableros ocupados: [${round.takenBoards.join(', ')}]`);
        console.log(`   - Jugadores: ${round.players.length}/${round.maxPlayers}`);
        console.log(`   - Sistema: ${actualAvailableBoards} tableros disponibles`);
        
        res.json({ 
            success: true, 
            message: 'Te has unido a la partida correctamente',
            playerCount: round.players.length,
            maxPlayers: round.maxPlayers,
            board: playerBoard,
            boardIndex: boardIndex,
            boardNumber: boardIndex + 1,
            requestedBoardIndex: selectedBoardIndex,
            assignedCorrectly: boardIndex === selectedBoardIndex,
            availableBoardsCount: actualAvailableBoards,
            boardsRemaining: actualAvailableBoards - round.takenBoards.length,
            systemInfo: {
                totalBoardsDesigned: TOTAL_BOARDS_COUNT,
                availableBoardsCount: actualAvailableBoards,
                maxBoardIndex: maxBoardIndex,
                validRange: `0-${maxBoardIndex}`,
                boardNumbers: `1-${maxBoardIndex + 1}`
            }
        });
        
    } catch (error) {
        console.error('❌ Error joining round:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// FUNCIÓN AUXILIAR: Encontrar primer tablero disponible
function findFirstAvailableBoard(takenBoards, maxBoardIndex) {
    for (let i = 0; i <= maxBoardIndex; i++) {
        if (!takenBoards.includes(i)) {
            return i;
        }
    }
    return -1; // No hay tableros disponibles
}

router.post('/:code/start', (req, res) => {
    try {
        const { code } = req.params;
        const { hostEmail } = req.body;
        
        const round = rounds.find(r => r.code === code);
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        if (round.hostEmail !== hostEmail) {
            return res.status(403).json({ error: 'Solo el host puede iniciar la partida' });
        }
        
        // ACTUALIZADO: Requerir al menos 3 jugadores (pero soportar hasta 50)
        if (round.players.length < 3) {
            return res.status(400).json({ 
                error: 'Se necesitan al menos 3 jugadores para comenzar',
                currentPlayers: round.players.length,
                maxPlayers: round.maxPlayers
            });
        }
        
        round.status = 'active';
        round.gameState = 'playing';
        round.startedAt = new Date();
        round.gameStartTime = new Date();
        
        console.log(`🚀 Partida ${code} iniciada por ${hostEmail}`);
        console.log(`📊 Jugadores: ${round.players.length}/${round.maxPlayers}`);
        console.log(`📋 Tableros en uso: ${round.takenBoards.length}/${AVAILABLE_BOARDS_COUNT}`);
        
        res.json({ 
            success: true, 
            message: 'Partida iniciada correctamente',
            playerCount: round.players.length,
            maxPlayers: round.maxPlayers,
            boardsInUse: round.takenBoards.length,
            availableBoardsCount: AVAILABLE_BOARDS_COUNT,
            autoEndOnWinners: round.autoEndOnWinners || false
        });
        
    } catch (error) {
        console.error('❌ Error starting round:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

router.get('/:code/boards', (req, res) => {
    try {
        const { code } = req.params;
        const round = rounds.find(r => r.code === code);
        
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        // ACTUALIZADO: Información extendida de tableros
        res.json({
            code: round.code,
            boards: round.boards,
            totalBoards: round.boards.length,
            takenBoards: round.takenBoards,
            availableBoards: round.boards.length - round.takenBoards.length,
            players: round.players.map(p => ({
                name: p.name,
                boardIndex: p.boardIndex,
                boardNumber: p.boardIndex + 1,
                board: p.board
            })),
            boardsInfo: round.boards.map((board, index) => ({
                index: index,
                boardNumber: index + 1,
                board: board,
                available: !round.takenBoards.includes(index),
                playerName: round.players.find(p => p.boardIndex === index)?.name || null
            })),
            // Información del sistema de tableros
            availableBoardsCount: AVAILABLE_BOARDS_COUNT,
            totalBoardsDesigned: TOTAL_BOARDS_COUNT,
            backupBoardsCount: TOTAL_BOARDS_COUNT - AVAILABLE_BOARDS_COUNT,
            maxPlayers: round.maxPlayers
        });
    } catch (error) {
        console.error('❌ Error getting boards:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para que el host vea jugadores en tiempo real - ACTUALIZADO
router.get('/:code/players', (req, res) => {
    try {
        const { code } = req.params;
        const round = rounds.find(r => r.code === code);
        
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        res.json({
            code: round.code,
            status: round.status,
            gameState: round.gameState,
            playerCount: round.players.length,
            maxPlayers: round.maxPlayers,
            players: round.players.map(p => ({
                name: p.name,
                joinedAt: p.joinedAt,
                boardIndex: p.boardIndex,
                boardNumber: p.boardIndex + 1
            })),
            canStart: round.players.length >= 3,
            // NUEVA información de capacidad
            capacityInfo: {
                current: round.players.length,
                maximum: round.maxPlayers,
                available: round.maxPlayers - round.players.length,
                percentageFull: Math.round((round.players.length / round.maxPlayers) * 100),
                availableBoardsCount: AVAILABLE_BOARDS_COUNT,
                boardsInUse: round.takenBoards.length,
                boardsRemaining: AVAILABLE_BOARDS_COUNT - round.takenBoards.length
            }
        });
    } catch (error) {
        console.error('❌ Error getting players:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// NUEVO: Endpoint para obtener información de capacidad
router.get('/:code/capacity', (req, res) => {
    try {
        const { code } = req.params;
        const round = rounds.find(r => r.code === code);
        
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        const capacityInfo = {
            players: {
                current: round.players.length,
                maximum: round.maxPlayers,
                available: round.maxPlayers - round.players.length,
                percentageFull: Math.round((round.players.length / round.maxPlayers) * 100)
            },
            boards: {
                inUse: round.takenBoards.length,
                available: AVAILABLE_BOARDS_COUNT - round.takenBoards.length,
                total: AVAILABLE_BOARDS_COUNT,
                designed: TOTAL_BOARDS_COUNT,
                backup: TOTAL_BOARDS_COUNT - AVAILABLE_BOARDS_COUNT
            },
            status: {
                canJoin: round.status !== 'finished' && round.players.length < round.maxPlayers,
                canStart: round.players.length >= 3,
                gameState: round.gameState,
                status: round.status
            }
        };
        
        res.json(capacityInfo);
        
    } catch (error) {
        console.error('❌ Error getting capacity info:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// NUEVO: Endpoint para recibir cartas barajeadas del host
router.post('/:code/shuffle', (req, res) => {
    try {
        const { code } = req.params;
        const { hostEmail, shuffledCards, timestamp } = req.body;
        
        console.log(`🎲 Recibiendo cartas barajeadas para partida ${code}`);
        console.log(`Host: ${hostEmail}`);
        console.log(`Cartas: ${shuffledCards}`);
        
        if (!hostEmail || !shuffledCards) {
            return res.status(400).json({ 
                error: 'hostEmail y shuffledCards son requeridos' 
            });
        }
        
        const round = rounds.find(r => r.code === code);
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        // Verificar que es el host autorizado
        if (round.hostEmail !== hostEmail) {
            return res.status(403).json({ 
                error: 'Solo el host puede enviar el orden de cartas' 
            });
        }
        
        // Validar cartas
        if (!Array.isArray(shuffledCards) || shuffledCards.length !== 24) {
            return res.status(400).json({ 
                error: 'shuffledCards debe ser un array de 24 cartas' 
            });
        }
        
        // Validar que contenga todas las cartas del 1 al 24
        const expectedCards = Array.from({length: 24}, (_, i) => i + 1);
        const sortedReceived = [...shuffledCards].sort((a, b) => a - b);
        
        if (JSON.stringify(sortedReceived) !== JSON.stringify(expectedCards)) {
            return res.status(400).json({ 
                error: 'Las cartas deben contener exactamente los números 1-24' 
            });
        }
        
        // CRÍTICO: Solo actualizar si no hay cartas ya barajeadas
        if (round.shuffledCards && round.shuffledCards.length > 0) {
            console.log('⚠️ Ya hay cartas barajeadas en el servidor');
            console.log('  Existentes:', round.shuffledCards);
            console.log('  Recibidas:', shuffledCards);
            
            // Verificar si son las mismas
            if (JSON.stringify(round.shuffledCards) === JSON.stringify(shuffledCards)) {
                console.log('✅ Cartas idénticas - Sin cambios');
            } else {
                console.log('❌ ADVERTENCIA: Intento de cambiar orden de cartas');
                return res.status(409).json({ 
                    error: 'Ya hay un orden de cartas establecido',
                    existingCards: round.shuffledCards,
                    message: 'No se puede cambiar el orden una vez establecido'
                });
            }
        } else {
            // Primera vez - guardar cartas
            round.shuffledCards = shuffledCards;
            round.shuffleTimestamp = timestamp || Date.now();
            console.log('✅ Cartas barajeadas guardadas en servidor');
        }
        
        res.json({ 
            success: true, 
            message: 'Orden de cartas sincronizado',
            shuffledCards: round.shuffledCards,
            cardsCount: round.shuffledCards.length,
            timestamp: round.shuffleTimestamp
        });
        
    } catch (error) {
        console.error('❌ Error procesando cartas barajeadas:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// NUEVO: Endpoint para habilitar tableros backup (uso futuro)
router.post('/:code/enable-backup-boards', (req, res) => {
    try {
        const { code } = req.params;
        const { hostEmail, enableCount = 10 } = req.body;
        
        const round = rounds.find(r => r.code === code);
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        if (round.hostEmail !== hostEmail) {
            return res.status(403).json({ error: 'Solo el host puede habilitar tableros backup' });
        }
        
        if (round.status !== 'waiting') {
            return res.status(400).json({ error: 'Solo se pueden habilitar tableros backup antes de iniciar la partida' });
        }
        
        const currentAvailable = round.availableBoardsCount || AVAILABLE_BOARDS_COUNT;
        const maxPossible = Math.min(TOTAL_BOARDS_COUNT, currentAvailable + enableCount);
        const newAvailableCount = maxPossible;
        
        // Actualizar tableros disponibles
        round.boards = SIXTY_PREDEFINED_BOARDS.slice(0, newAvailableCount);
        round.availableBoardsCount = newAvailableCount;
        round.maxPlayers = Math.min(round.maxPlayers, newAvailableCount);
        
        console.log(`🔓 Tableros backup habilitados en partida ${code}`);
        console.log(`📊 Tableros disponibles: ${currentAvailable} → ${newAvailableCount}`);
        
        res.json({
            success: true,
            message: 'Tableros backup habilitados correctamente',
            boardsInfo: {
                previousCount: currentAvailable,
                newCount: newAvailableCount,
                backupEnabled: newAvailableCount - currentAvailable,
                totalDesigned: TOTAL_BOARDS_COUNT
            },
            maxPlayers: round.maxPlayers
        });
        
    } catch (error) {
        console.error('❌ Error enabling backup boards:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// NUEVO: Endpoint para estadísticas del sistema de tableros
router.get('/system/board-stats', (req, res) => {
    try {
        const stats = {
            systemInfo: {
                totalBoardsDesigned: TOTAL_BOARDS_COUNT,
                availableBoardsDefault: AVAILABLE_BOARDS_COUNT,
                backupBoardsCount: TOTAL_BOARDS_COUNT - AVAILABLE_BOARDS_COUNT,
                maxPlayersDefault: MAX_PLAYERS_DEFAULT,
                maxPlayersAbsolute: MAX_PLAYERS_TOTAL
            },
            currentRounds: rounds.map(r => ({
                code: r.code,
                players: r.players.length,
                maxPlayers: r.maxPlayers,
                boardsInUse: r.takenBoards.length,
                availableBoards: (r.availableBoardsCount || AVAILABLE_BOARDS_COUNT) - r.takenBoards.length,
                status: r.status,
                gameState: r.gameState
            })),
            aggregatedStats: {
                totalRounds: rounds.length,
                activeRounds: rounds.filter(r => r.status === 'active').length,
                totalPlayersAcrossRounds: rounds.reduce((sum, r) => sum + r.players.length, 0),
                totalBoardsInUse: rounds.reduce((sum, r) => sum + r.takenBoards.length, 0),
                averagePlayersPerRound: rounds.length > 0 ? 
                    Math.round((rounds.reduce((sum, r) => sum + r.players.length, 0) / rounds.length) * 100) / 100 : 0
            }
        };
        
        res.json(stats);
        
    } catch (error) {
        console.error('❌ Error getting board stats:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// CORREGIDO: Endpoint call-card con soporte para trigger de carta 25
router.post('/:code/call-card', (req, res) => {
    try {
        const { code } = req.params;
        const { hostEmail, calledCard } = req.body;
        
        if (!hostEmail || calledCard === undefined) {
            return res.status(400).json({ error: 'Email del host y carta llamada son requeridos' });
        }
        
        const round = rounds.find(r => r.code === code);
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        if (round.hostEmail !== hostEmail) {
            return res.status(403).json({ error: 'Solo el host puede llamar cartas' });
        }
        
        if (round.status !== 'active') {
            return res.status(400).json({ error: 'La partida debe estar activa para llamar cartas' });
        }
        
        // NUEVO: Manejar trigger especial (carta 25)
        if (calledCard === 25) {
            console.log(`🎯 TRIGGER ESPECIAL recibido en partida ${code}`);
            console.log(`📋 Cartas actuales: ${round.calledNumbers ? round.calledNumbers.length : 0}/24`);
            
            // Verificar que realmente se hayan cantado 24 cartas
            if (!round.calledNumbers || round.calledNumbers.length < 24) {
                console.log(`⚠️ Trigger recibido pero solo hay ${round.calledNumbers ? round.calledNumbers.length : 0} cartas`);
                return res.status(400).json({ 
                    error: 'Trigger inválido - no se han completado las 24 cartas',
                    currentCards: round.calledNumbers ? round.calledNumbers.length : 0,
                    trigger: true
                });
            }
            
            // ACTUALIZAR currentNumber para que CardDisplayScene muestre la carta 24
            const lastValidCard = round.calledNumbers[round.calledNumbers.length - 1];
            round.currentNumber = lastValidCard;
            round.lastCardTime = new Date();
            
            // MARCAR QUE SE ENVIÓ EL TRIGGER
            if (!round.triggerSent) {
                round.triggerSent = true;
                round.triggerTime = new Date();
            }
            
            console.log(`✅ Trigger procesado - CardDisplayScene debe mostrar carta ${lastValidCard}`);
            
            // Respuesta especial para trigger
            return res.json({
                success: true,
                message: 'Trigger procesado - Mostrando última carta',
                trigger: true,
                triggerCard: 25,
                displayCard: lastValidCard,
                totalCalled: round.calledNumbers.length,
                calledNumbers: round.calledNumbers,
                currentNumber: round.currentNumber,
                allCardsCompleted: true,
                winners: round.winners || []
            });
        }
        
        // VALIDAR cartas normales (1-24)
        if (calledCard < 1 || calledCard > 24) {
            console.log(`⚠️ Carta fuera de rango rechazada: ${calledCard}`);
            return res.status(400).json({ error: 'Carta debe estar entre 1 y 24' });
        }
        
        // Verificar límite de 24 cartas
        if (round.calledNumbers && round.calledNumbers.length >= 24) {
            console.log(`⚠️ Ya se cantaron 24 cartas, rechazando carta ${calledCard}`);
            return res.status(400).json({ 
                error: 'Ya se cantaron las 24 cartas máximas',
                totalCalled: round.calledNumbers.length,
                suggestion: 'Usa el trigger (carta 25) o termina la partida'
            });
        }
        
        // Inicializar arrays si no existen
        if (!round.calledNumbers) {
            round.calledNumbers = [];
        }
        
        // Verificar si la carta ya fue llamada
        if (round.calledNumbers.includes(calledCard)) {
            return res.status(400).json({ error: 'Esta carta ya fue llamada' });
        }
        
        // AGREGAR CARTA NORMAL (1-24)
        round.calledNumbers.push(calledCard);
        round.currentNumber = calledCard;
        round.lastCardTime = new Date();
        
        // Agregar al historial
        if (!round.cardHistory) {
            round.cardHistory = [];
        }
        round.cardHistory.push({
            card: calledCard,
            time: new Date(),
            sequence: round.calledNumbers.length
        });
        
        console.log(`🎴 Carta ${calledCard} llamada en partida ${code}`);
        console.log(`📊 Total cartas llamadas: ${round.calledNumbers.length}/24`);
        console.log(`📜 Secuencia: ${round.calledNumbers.join(', ')}`);
        
        // Respuesta para cartas normales
        var responseData = {
            success: true,
            message: 'Carta llamada correctamente',
            calledCard: calledCard,
            totalCalled: round.calledNumbers.length,
            calledNumbers: round.calledNumbers,
            currentNumber: round.currentNumber,
            maxCards: 24,
            remainingCards: 24 - round.calledNumbers.length
        };
        
        // Incluir ganadores si los hay
        if (round.winners && round.winners.length > 0) {
            responseData.winners = round.winners;
            responseData.winnerCount = round.winners.length;
        }
        
        // Verificar si se completaron las 24 cartas
        if (round.calledNumbers.length >= 24) {
            console.log(`📋 Partida ${code} completó las 24 cartas - Listo para trigger`);
            responseData.allCardsCompleted = true;
            responseData.message += ' - Todas las cartas cantadas - Listo para trigger';
            responseData.readyForTrigger = true;
        }
        
        res.json(responseData);
        
    } catch (error) {
        console.error('❌ Error calling card:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// MEJORADO: Endpoint status con mejor información de trigger
router.get('/:code/status', (req, res) => {
    try {
        const { code } = req.params;
        const round = rounds.find(r => r.code === code);
        
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        // INFORMACIÓN MEJORADA para CardDisplayScene
        const responseData = {
            code: round.code,
            status: round.status,
            gameState: round.gameState,
            calledNumbers: round.calledNumbers || [],
            currentNumber: round.currentNumber || null,
            totalCalled: round.calledNumbers ? round.calledNumbers.length : 0,
            remainingCards: 24 - (round.calledNumbers ? round.calledNumbers.length : 0),
            winners: round.winners || [],
            winnerCount: round.winners ? round.winners.length : 0,
            maxWinners: round.maxWinners || 999,
            autoEndOnWinners: round.autoEndOnWinners || false,
            playerCount: round.players.length,
            maxPlayers: round.maxPlayers,
            gameStartTime: round.gameStartTime,
            lastCardTime: round.lastCardTime,
            allCardsCompleted: round.calledNumbers ? round.calledNumbers.length >= 24 : false,
            
            // NUEVO: Información específica del trigger
            triggerSent: round.triggerSent || false,
            triggerTime: round.triggerTime || null,
            readyForTrigger: round.calledNumbers ? round.calledNumbers.length >= 24 : false
        };
        
        // LOGGING para debug
        if (round.calledNumbers && round.calledNumbers.length > 0) {
            console.log(`📊 Status ${code}: ${round.calledNumbers.length} cartas, current: ${round.currentNumber}, trigger: ${round.triggerSent || false}`);
        }
        
        res.json(responseData);
        
    } catch (error) {
        console.error('❌ Error getting status:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para verificar bingo
router.post('/:code/bingo', (req, res) => {
    try {
        const { code } = req.params;
        const { playerName, markedTiles } = req.body;
        
        if (!playerName || !markedTiles) {
            return res.status(400).json({ error: 'Nombre del jugador y tiles marcados son requeridos' });
        }
        
        const round = rounds.find(r => r.code === code);
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        const player = round.players.find(p => p.name === playerName);
        if (!player) {
            return res.status(404).json({ error: 'Jugador no encontrado en la partida' });
        }
        
        if (round.status !== 'active') {
            return res.status(400).json({ error: 'Solo se puede verificar bingo en partidas activas' });
        }
        
        // Verificar si el jugador ya es ganador
        const existingWinner = round.winners.find(w => w.playerName === playerName);
        if (existingWinner) {
            return res.status(400).json({ 
                error: 'Ya eres ganador de esta partida',
                winPosition: existingWinner.position,
                winTime: existingWinner.completedAt
            });
        }
        
        // Verificar bingo usando la función auxiliar
        const bingoResult = verifyBingo(
            markedTiles, 
            player.board, 
            round.calledNumbers || [],
            { playerName: playerName }
        );
        
        if (!bingoResult.valid) {
            console.log(`❌ Bingo inválido de ${playerName}: ${bingoResult.reason}`);
            return res.status(400).json({ 
                error: bingoResult.message,
                reason: bingoResult.reason,
                details: bingoResult
            });
        }
        
        // ¡BINGO VÁLIDO! Agregar como ganador
        if (!round.winners) {
            round.winners = [];
        }
        
        const winnerPosition = round.winners.length + 1;
        const newWinner = {
            playerName: playerName,
            position: winnerPosition,
            completedAt: new Date(),
            board: player.board,
            markedTiles: markedTiles,
            boardIndex: player.boardIndex,
            totalCardsWhenWon: round.calledNumbers.length,
            calledNumbersWhenWon: [...round.calledNumbers]
        };
        
        round.winners.push(newWinner);
        round.winnerCount = round.winners.length;
        
        // Actualizar información del jugador
        player.markedNumbers = markedTiles;
        player.isWinner = true;
        player.winPosition = winnerPosition;
        player.winTime = newWinner.completedAt;
        
        console.log(`🎉 ¡BINGO VÁLIDO! ${playerName} es el ${getPositionText(winnerPosition)} ganador`);
        console.log(`📊 Total ganadores: ${round.winners.length}`);
        
        const responseData = {
            success: true,
            message: `¡Felicidades! Eres el ${getPositionText(winnerPosition)} ganador`,
            isValid: true,
            position: winnerPosition,
            positionText: getPositionText(winnerPosition),
            completedAt: newWinner.completedAt,
            totalWinners: round.winners.length,
            maxWinners: round.maxWinners,
            totalCardsWhenWon: round.calledNumbers.length,
            allWinners: round.winners.map(w => ({
                playerName: w.playerName,
                position: w.position,
                completedAt: w.completedAt
            }))
        };
        
        // Verificar si se debe terminar automáticamente la partida
        if (round.autoEndOnWinners && round.winners.length >= round.maxWinners) {
            round.status = 'finished';
            round.gameState = 'ended';
            round.gameFinishedTime = new Date();
            responseData.gameEnded = true;
            responseData.reason = 'max_winners_reached';
            console.log(`🏁 Partida ${code} terminó automáticamente (${round.winners.length} ganadores)`);
        }
        
        res.json(responseData);
        
    } catch (error) {
        console.error('❌ Error verifying bingo:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Endpoint para terminar una partida
router.post('/:code/end', (req, res) => {
    try {
        const { code } = req.params;
        const { hostEmail, reason = 'host_ended' } = req.body;
        
        const round = rounds.find(r => r.code === code);
        if (!round) {
            return res.status(404).json({ error: 'Partida no encontrada' });
        }
        
        if (round.hostEmail !== hostEmail) {
            return res.status(403).json({ error: 'Solo el host puede terminar la partida' });
        }
        
        if (round.status === 'finished') {
            return res.status(400).json({ error: 'La partida ya ha terminado' });
        }
        
        round.status = 'finished';
        round.gameState = 'ended';
        round.gameFinishedTime = new Date();
        round.endReason = reason;
        
        console.log(`🏁 Partida ${code} terminada por ${hostEmail} (${reason})`);
        console.log(`📊 Final stats: ${round.players.length} jugadores, ${round.winners.length} ganadores`);
        
        res.json({
            success: true,
            message: 'Partida terminada correctamente',
            finalStats: {
                totalPlayers: round.players.length,
                totalWinners: round.winners.length,
                cardsCalledTotal: round.calledNumbers ? round.calledNumbers.length : 0,
                gameEndTime: round.gameFinishedTime,
                endReason: reason,
                winners: round.winners || []
            }
        });
        
    } catch (error) {
        console.error('❌ Error ending round:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// Función auxiliar para verificar bingo
function verifyBingo(markedTiles, playerBoard, calledNumbers, playerData = {}) {
    console.log("=== VERIFICANDO BINGO ===");
    console.log("Jugador:", playerData.playerName || "Desconocido");
    console.log("Tablero del jugador:", playerBoard);
    console.log("Tiles marcados:", markedTiles);
    console.log("Cartas llamadas:", calledNumbers);
    
    // Convertir tablero 3x3 a array plano para comparar con markedTiles
    const boardFlat = [];
    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            boardFlat.push(playerBoard[row][col]);
        }
    }
    
    console.log("Tablero plano:", boardFlat);
    
    // PASO 1: Verificar que todas las cartas del tablero hayan sido llamadas
    const missingCards = [];
    for (let i = 0; i < boardFlat.length; i++) {
        const number = boardFlat[i];
        if (!calledNumbers.includes(number)) {
            missingCards.push(number);
        }
    }
    
    if (missingCards.length > 0) {
        console.log(`❌ BINGO INVÁLIDO: Faltan cartas por salir: ${missingCards.join(', ')}`);
        return {
            valid: false,
            reason: 'missing_cards',
            message: `Faltan cartas por salir: ${missingCards.join(', ')}`,
            missingCards: missingCards
        };
    }
    
    // PASO 2: Verificar que el jugador haya marcado TODAS las casillas
    const unmarkedTiles = [];
    for (let i = 0; i < markedTiles.length; i++) {
        if (!markedTiles[i]) {
            unmarkedTiles.push({
                index: i,
                number: boardFlat[i]
            });
        }
    }
    
    if (unmarkedTiles.length > 0) {
        console.log(`❌ BINGO INVÁLIDO: Casillas sin marcar:`, unmarkedTiles);
        return {
            valid: false,
            reason: 'unmarked_tiles',
            message: `Debes marcar todas las casillas de tu tablero`,
            unmarkedTiles: unmarkedTiles
        };
    }
    
    // PASO 3: Verificar que solo se hayan marcado números que realmente salieron
    const invalidMarks = [];
    for (let i = 0; i < markedTiles.length; i++) {
        if (markedTiles[i]) {
            const number = boardFlat[i];
            if (!calledNumbers.includes(number)) {
                invalidMarks.push({
                    index: i,
                    number: number
                });
            }
        }
    }
    
    if (invalidMarks.length > 0) {
        console.log(`❌ BINGO INVÁLIDO: Números marcados incorrectamente:`, invalidMarks);
        return {
            valid: false,
            reason: 'invalid_marks',
            message: `Tienes números marcados que no han salido`,
            invalidMarks: invalidMarks
        };
    }
    
    // PASO 4: ¡BINGO VÁLIDO!
    console.log("✅ ¡BINGO VÁLIDO! Todas las verificaciones pasaron");
    return {
        valid: true,
        reason: 'complete_board',
        message: '¡Felicidades! ¡Ganaste el BINGO!',
        completedAt: new Date(),
        boardNumbers: boardFlat,
        totalCardsInBoard: boardFlat.length
    };
}

function getPositionText(position) {
    switch(position) {
        case 1: return "primer";
        case 2: return "segundo"; 
        case 3: return "tercer";
        case 4: return "cuarto";
        case 5: return "quinto";
        default: return position + "°";
    }
}

module.exports = router;
