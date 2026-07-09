document.addEventListener("DOMContentLoaded", () => {

	const footerHost = document.getElementById("footer");

	if (!footerHost) return;

	fetch("components/footer.html")
		.then(response => response.text())
		.then(data => {

			footerHost.innerHTML = data;
			highlightFooterPage();

		});

});

function highlightFooterPage() {

	const page = window.location.pathname.split("/").pop() || "index.html";
	const links = document.querySelectorAll(".footer-link");

	links.forEach(link => {

		link.classList.remove("active");

		const href = link.getAttribute("href") || "";
		const target = href.split("#")[0];

		if (page === "" && target === "index.html") {

			link.classList.add("active");

		} else if (target === page) {

			link.classList.add("active");

		}

	});

}