import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

export default function TournamentApp() {
const [teams, setTeams] = useState([""]);
const [started, setStarted] = useState(false);
const [winnerRounds, setWinnerRounds] = useState([]);
const [loserRounds, setLoserRounds] = useState([]);
const [winnersMap, setWinnersMap] = useState({});
const [tournamentId, setTournamentId] = useState("");
const [deferredPrompt, setDeferredPrompt] = useState(null);
const [installable, setInstallable] = useState(false);

useEffect(() => {
const existingId = window.location.pathname.split("/").pop();
const id = existingId || uuidv4();
setTournamentId(id);
if (!existingId) window.history.replaceState({}, "", /${id});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  setDeferredPrompt(e);
  setInstallable(true);
});


}, []);

const shareURL = ${window.location.origin}/${tournamentId};
const openChatMessage = ⚾ 野球トーナメントに参加しよう！\n\n👉 ${shareURL};
const lineURL = https://line.me/R/msg/text/?${encodeURIComponent(openChatMessage)};

const handleInstall = async () => {
if (deferredPrompt) {
deferredPrompt.prompt();
await deferredPrompt.userChoice;
setDeferredPrompt(null);
setInstallable(false);
}
};

const handleTeamChange = (i, val) => {
const updated = [...teams];
updated[i] = val;
setTeams(updated);
};

const addTeam = () => setTeams([...teams, ""]);

const selectWinner = (bracket, rIdx, mIdx, winner, loser) => {
const key = ${bracket}-${rIdx}-${mIdx};
setWinnersMap({ ...winnersMap, [key]: { winner, loser } });
};

const startTournament = () => {
const validTeams = teams.filter(Boolean);
const shuffled = [...validTeams].sort(() => Math.random() - 0.5);
const round = [];
for (let i = 0; i < shuffled.length; i += 2) {
round.push([shuffled[i], shuffled[i + 1] || "BYE"]);
}
setWinnerRounds([round]);
setLoserRounds([]);
setStarted(true);
setWinnersMap({});
};

const buildNextRound = (rounds, bracketKey) => {
const last = rounds[rounds.length - 1];
const results = [];
for (let i = 0; i < last.length; i++) {
const key = ${bracketKey}-${rounds.length - 1}-${i};
results.push(winnersMap[key]?.winner || last[i][0]);
}
const next = [];
for (let i = 0; i < results.length; i += 2) {
next.push([results[i], results[i + 1] || "BYE"]);
}
return next;
};

const nextRound = () => {
const winnersNext = buildNextRound(winnerRounds, "W");
const losersNow = [];
const lastWinners = winnerRounds[winnerRounds.length - 1];
lastWinners.forEach((match, i) => {
const key = W-${winnerRounds.length - 1}-${i};
const loser = winnersMap[key]?.loser;
if (loser && loser !== "BYE") losersNow.push(loser);
});
const losersPrev = loserRounds.length ? loserRounds[loserRounds.length - 1].flat() : [];
const newLosers = [...losersPrev.filter(t => t && t !== "BYE"), ...losersNow];
const loserPairs = [];
for (let i = 0; i < newLosers.length; i += 2) {
loserPairs.push([newLosers[i], newLosers[i + 1] || "BYE"]);
}
setWinnerRounds([...winnerRounds, winnersNext]);
setLoserRounds([...loserRounds, loserPairs]);
};

const renderBracket = (rounds, key) => (
rounds.map((round, rIdx) => (
<Card key={${key}-r${rIdx}} className="mb-4 rounded-2xl shadow-xl bg-gradient-to-br from-white to-slate-100">


{key === "W" ? "勝者側" : "敗者側"} ラウンド {rIdx + 1}

{round.map((match, mIdx) => {
const matchKey = ${key}-${rIdx}-${mIdx};
return (


{match[0]}
vs
{match[1]}



<Button
size="sm"
variant={winnersMap[matchKey]?.winner === match[0] ? "default" : "outline"}
onClick={() => selectWinner(key, rIdx, mIdx, match[0], match[1])}
>{match[0]} 勝
<Button
size="sm"
variant={winnersMap[matchKey]?.winner === match[1] ? "default" : "outline"}
onClick={() => selectWinner(key, rIdx, mIdx, match[1], match[0])}
disabled={match[1] === "BYE"}
>{match[1]} 勝




);
})}


))
);

return (


{installable && (

📲 ホーム画面に追加

)}
{!started ? (
<motion.div layout>
チーム登録

{teams.map((team, idx) => (
<Input
key={idx}
className="mb-2"
placeholder={チーム${idx + 1}}
value={team}
onChange={e => handleTeamChange(idx, e.target.value)}
/>
))}

＋ チーム追加
<Button onClick={startTournament} disabled={teams.filter(t => t).length < 2}>
▶ トーナメント開始



</motion.div>
) : (
<motion.div layout>
ダブルトーナメント表

{renderBracket(winnerRounds, "W")}
{renderBracket(loserRounds, "L")}

➡ 次のラウンドへ


招待URL:


<Button
onClick={() => {
navigator.clipboard.writeText(shareURL);
alert("URLをコピーしました！");
}}
className="mb-2 w-full"
>URLをコピー


📩 LINEオープンチャットに招待リンクを送る




</motion.div>
)}


);
}
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";

export default function TournamentApp() {
const [teams, setTeams] = useState([""]);
const [started, setStarted] = useState(false);
const [winnerRounds, setWinnerRounds] = useState([]);
const [loserRounds, setLoserRounds] = useState([]);
const [winnersMap, setWinnersMap] = useState({});
const [tournamentId, setTournamentId] = useState("");
const [deferredPrompt, setDeferredPrompt] = useState(null);
const [installable, setInstallable] = useState(false);

useEffect(() => {
const existingId = window.location.pathname.split("/").pop();
const id = existingId || uuidv4();
setTournamentId(id);
if (!existingId) window.history.replaceState({}, "", /${id});

window.addEventListener("beforeinstallprompt", (e) => {
  e.preventDefault();
  setDeferredPrompt(e);
  setInstallable(true);
});


}, []);

const shareURL = ${window.location.origin}/${tournamentId};
const openChatMessage = ⚾ 野球トーナメントに参加しよう！\n\n👉 ${shareURL};
const lineURL = https://line.me/R/msg/text/?${encodeURIComponent(openChatMessage)};

const handleInstall = async () => {
if (deferredPrompt) {
deferredPrompt.prompt();
await deferredPrompt.userChoice;
setDeferredPrompt(null);
setInstallable(false);
}
};

const handleTeamChange = (i, val) => {
const updated = [...teams];
updated[i] = val;
setTeams(updated);
};

const addTeam = () => setTeams([...teams, ""]);

const selectWinner = (bracket, rIdx, mIdx, winner, loser) => {
const key = ${bracket}-${rIdx}-${mIdx};
setWinnersMap({ ...winnersMap, [key]: { winner, loser } });
};

const startTournament = () => {
const validTeams = teams.filter(Boolean);
const shuffled = [...validTeams].sort(() => Math.random() - 0.5);
const round = [];
for (let i = 0; i < shuffled.length; i += 2) {
round.push([shuffled[i], shuffled[i + 1] || "BYE"]);
}
setWinnerRounds([round]);
setLoserRounds([]);
setStarted(true);
setWinnersMap({});
};

const buildNextRound = (rounds, bracketKey) => {
const last = rounds[rounds.length - 1];
const results = [];
for (let i = 0; i < last.length; i++) {
const key = ${bracketKey}-${rounds.length - 1}-${i};
results.push(winnersMap[key]?.winner || last[i][0]);
}
const next = [];
for (let i = 0; i < results.length; i += 2) {
next.push([results[i], results[i + 1] || "BYE"]);
}
return next;
};

const nextRound = () => {
const winnersNext = buildNextRound(winnerRounds, "W");
const losersNow = [];
const lastWinners = winnerRounds[winnerRounds.length - 1];
lastWinners.forEach((match, i) => {
const key = W-${winnerRounds.length - 1}-${i};
const loser = winnersMap[key]?.loser;
if (loser && loser !== "BYE") losersNow.push(loser);
});
const losersPrev = loserRounds.length ? loserRounds[loserRounds.length - 1].flat() : [];
const newLosers = [...losersPrev.filter(t => t && t !== "BYE"), ...losersNow];
const loserPairs = [];
for (let i = 0; i < newLosers.length; i += 2) {
loserPairs.push([newLosers[i], newLosers[i + 1] || "BYE"]);
}
setWinnerRounds([...winnerRounds, winnersNext]);
setLoserRounds([...loserRounds, loserPairs]);
};

const renderBracket = (rounds, key) => (
rounds.map((round, rIdx) => (
<Card key={${key}-r${rIdx}} className="mb-4 rounded-2xl shadow-xl bg-gradient-to-br from-white to-slate-100">


{key === "W" ? "勝者側" : "敗者側"} ラウンド {rIdx + 1}

{round.map((match, mIdx) => {
const matchKey = ${key}-${rIdx}-${mIdx};
return (


{match[0]}
vs
{match[1]}



<Button
size="sm"
variant={winnersMap[matchKey]?.winner === match[0] ? "default" : "outline"}
onClick={() => selectWinner(key, rIdx, mIdx, match[0], match[1])}
>{match[0]} 勝
<Button
size="sm"
variant={winnersMap[matchKey]?.winner === match[1] ? "default" : "outline"}
onClick={() => selectWinner(key, rIdx, mIdx, match[1], match[0])}
disabled={match[1] === "BYE"}
>{match[1]} 勝




);
})}


))
);

return (


{installable && (

📲 ホーム画面に追加

)}
{!started ? (
<motion.div layout>
チーム登録

{teams.map((team, idx) => (
<Input
key={idx}
className="mb-2"
placeholder={チーム${idx + 1}}
value={team}
onChange={e => handleTeamChange(idx, e.target.value)}
/>
))}

＋ チーム追加
<Button onClick={startTournament} disabled={teams.filter(t => t).length < 2}>
▶ トーナメント開始



</motion.div>
) : (
<motion.div layout>
ダブルトーナメント表

{renderBracket(winnerRounds, "W")}
{renderBracket(loserRounds, "L")}

➡ 次のラウンドへ


招待URL:


<Button
onClick={() => {
navigator.clipboard.writeText(shareURL);
alert("URLをコピーしました！");
}}
className="mb-2 w-full"
>URLをコピー


📩 LINEオープンチャットに招待リンクを送る




</motion.div>
)}


);
}

