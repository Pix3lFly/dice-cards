/* ===== v4 (26 Nov): owner/moderator panel gets the gold corner pieces ===== */
setInterval(()=>{try{document.querySelectorAll('#ownp .uc.opw').forEach(u=>{if(!u.querySelector(':scope>.cco'))u.insertAdjacentHTML('beforeend','<i class="cco tl"></i><i class="cco tr"></i><i class="cco bl"></i><i class="cco br"></i>')})}catch(e){}},400);
