/* Original, lightweight vector illustrations. No external image or font requests. */
function CardArt(id){
const motifs={
scout:'<path d="M27 79L48 42 61 48 73 81M47 44L39 29 53 15 69 31 61 49M35 37L18 66M65 36L83 56M73 21L81 77"/><path d="M80 20L92 28 81 37"/>',
guard:'<path d="M29 87V40L50 23 72 40V87M34 37L50 11 66 37M21 91H80"/><path d="M49 48L72 54 68 76 49 91 33 76 29 54Z"/><path d="M49 56V80M38 66H61"/>',
wolf:'<path d="M14 65L27 44 24 18 44 33 59 26 79 14 76 48 88 69 68 83 39 85Z"/><path d="M30 51L44 56M62 53L75 46M42 70L53 77 63 68M52 77V86"/>',
medic:'<path d="M37 86L42 46 29 34 39 14 58 13 70 34 60 46 68 86Z"/><path d="M13 53H35M24 42V64M74 56H94M84 46V66"/><circle cx="50" cy="33" r="10"/><path d="M42 63H60M51 54V73"/>',
captain:'<path d="M25 89L34 53 52 45 72 57 82 89M37 45L32 29 49 14 65 29 60 48M20 13V93M21 15H81L66 30 81 43H21"/><path d="M39 60L53 78 66 60"/>',
knight:'<path d="M28 87L32 55 49 46 70 56 77 88M33 43L29 27 50 11 72 27 67 45 49 52Z"/><path d="M34 30H66M48 30V46M78 12V70M70 55H87"/><path d="M21 55L40 62 36 81 21 92 9 80 7 62Z"/>',
spark:'<path d="M15 90L45 48 37 47 69 7 60 37 83 24 68 54 78 52 40 85 47 63Z"/><path d="M13 63L26 57M40 18L44 30M80 71L88 67"/>',
study:'<path d="M10 35L49 44 89 31V79L49 89 10 79ZM49 45V89M17 45L40 52M18 58L40 64M59 50L82 43M59 63L82 56"/><circle cx="52" cy="22" r="11"/><path d="M52 6V1M34 21H27M70 21H78"/>',
mage:'<path d="M23 86L35 51 60 48 78 86M33 40H72L54 8Z"/><circle cx="51" cy="46" r="11"/><path d="M82 26V90M75 21L83 8 91 21 83 33ZM27 57L12 45M14 34V51M6 42H23"/>',
sentinel:'<path d="M50 8L77 37 70 70 50 91 26 69 22 38Z"/><path d="M50 8L39 39 50 91 61 40ZM22 38L39 39 50 28 61 40 77 37M26 69L50 61 70 70"/><path d="M9 27V42M2 34H17M88 62V77M81 69H96"/>',
oracle:'<path d="M62 9A29 29 0 1 0 87 51A24 24 0 0 1 62 9Z"/><path d="M27 90L35 64 51 56 68 65 76 90"/><circle cx="51" cy="49" r="12"/><path d="M12 18V30M6 24H18M79 10V22M73 16H85"/>',
nova:'<path d="M60 10L39 42 12 65 33 62 39 87 56 60 89 35 66 40 78 7Z"/><circle cx="48" cy="56" r="15"/><path d="M17 18V32M10 25H24M81 66V83M73 74H89"/>',
giant:'<path d="M22 91L17 55 33 43 29 25 45 12 62 14 76 31 68 48 85 63 81 91Z"/><path d="M29 58L47 51 64 59 63 84H37ZM36 31L46 35M56 35L66 30M46 45H59M14 66L28 73M73 73L91 65"/>',
drake:'<path d="M12 70L14 24 38 43 49 29 66 42 88 18 91 71 71 57 66 83 51 92 33 79 30 59Z"/><path d="M39 42L43 15 55 27 64 13 66 44M40 57L51 64 65 54M51 64L51 91"/><circle cx="51" cy="13" r="7"/>',
renew:'<path d="M10 81Q50 66 91 81M18 89Q50 78 81 89M50 68V42M50 55Q23 58 23 29Q49 29 50 55M51 46Q77 49 79 20Q54 20 51 46"/><path d="M50 7Q31 30 50 32Q67 29 50 7Z"/>',
sage:'<path d="M16 40L50 49 84 40V81L50 91 16 81ZM50 49V91M31 32L32 16 49 8 68 17 67 32M37 23H61M50 23V39M24 55L40 60M59 60L76 55M24 67L40 72M59 72L76 67"/><circle cx="50" cy="25" r="23"/>'};
return `<svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="44" fill="currentColor" opacity=".07"/><circle cx="50" cy="50" r="43" stroke="currentColor" opacity=".22"/><g stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" fill="currentColor" fill-opacity=".12">${motifs[id]||motifs.study}</g></svg>`;
}
