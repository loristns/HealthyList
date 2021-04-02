// @ts-nocheck

function subscribeToScanner(vue) {
    Quagga.init(
        {
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#video-container')
            },
            decoder: {
                readers: ["ean_reader"]
            }
        },
        function (err) {
            if (err) {
                console.error('This happened :', err);
                return;
            }
        
            Quagga.onDetected((data) => {
                Quagga.stop();
                vue.$emit('new-barcode-detected', data.codeResult.code);
            });

            Quagga.start();
        }
    );
}
