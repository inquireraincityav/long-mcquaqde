#!/bin/bash
# Run this script locally to download real product images from Long & McQuade
# Usage: chmod +x download-images.sh && ./download-images.sh

mkdir -p public/products

# Yorkville Sound YXL12P 12 Inch 1000 Watt Powered Loudspeaker
echo "Downloading yorkville-sound-yxl12p-12-inch-1000-watt-51023a78..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/165008/Pro-Audio-Recording/PA-Speaker-Cabinets/Yorkville-Sound/YXL12P-12-Inch-1000-Watt-Powered-Loudspeaker.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/yorkville-sound-yxl12p-12-inch-1000-watt-51023a78.jpg"
fi

# Yorkville SoundEXM Mobile Tower Battery Powered PA System
echo "Downloading yorkville-soundexm-mobile-tower-battery--9a15fae2..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/347101/Pro-Audio-Recording/PA-Speaker-Cabinets/Yorkville-Sound/EXM-Mobile-Tower-Battery-Powered-PA-System.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/yorkville-soundexm-mobile-tower-battery--9a15fae2.jpg"
fi

# JBL EON715 15 Inch Powered PA Speaker with Bluetooth
echo "Downloading jbl-eon715-15-inch-powered-pa-speaker-wi-b8e21fdc..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/339447/Pro-Audio-Recording/PA-Speaker-Cabinets/JBL/EON715-15-Inch-Powered-PA-Speaker-with-Bluetooth.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/jbl-eon715-15-inch-powered-pa-speaker-wi-b8e21fdc.jpg"
fi

# QSC K12.2 12 Inch 2000W Powered Loudspeaker
echo "Downloading qsc-k122-12-inch-2000w-powered-loudspeak-4e4195ad..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/119839/Pro-Audio-Recording/PA-Speaker-Cabinets/QSC/K12-2-12-Inch-2000W-Powered-Loudspeaker.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/qsc-k122-12-inch-2000w-powered-loudspeak-4e4195ad.jpg"
fi

# JBL PRX418S 18 Inch Passive Subwoofer
echo "Downloading jbl-prx418s-18-inch-passive-subwoofer-2155d18d..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/56124/Pro-Audio-Recording/PA-Speaker-Cabinets/JBL/PRX418S-18-Inch-Passive-Subwoofer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/jbl-prx418s-18-inch-passive-subwoofer-2155d18d.jpg"
fi

# Bose L1 Pro32 Portable Line Array System
echo "Downloading bose-l1-pro32-portable-line-array-system-566351b7..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/287891/Pro-Audio-Recording/PA-Speaker-Cabinets/Bose/L1-Pro32-Portable-Line-Array-System.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/bose-l1-pro32-portable-line-array-system-566351b7.jpg"
fi

# Electro-Voice ZLX-12P 12 Inch Two-Way Powered Loudspeaker
echo "Downloading electro-voice-zlx-12p-12-inch-two-way-po-bf14ecf6..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/73612/Pro-Audio-Recording/PA-Speaker-Cabinets/Electro-Voice/ZLX-12P-12-Inch-Two-Way-Powered-Loudspeaker.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/electro-voice-zlx-12p-12-inch-two-way-po-bf14ecf6.jpg"
fi

# Yorkville Sound Tripod Boom Stand - Black
echo "Downloading yorkville-sound-tripod-boom-stand---blac-ff9cb9da..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/8769/Pro-Audio-Recording/Furniture-Stands/Yorkville-Sound/Tripod-Boom-Stand-Black.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/yorkville-sound-tripod-boom-stand---blac-ff9cb9da.jpg"
fi

# Mackie Thump212XT 12 Inch 1400W Enhanced Powered Loudspeaker
echo "Downloading mackie-thump212xt-12-inch-1400w-enhanced-fd0eb9a7..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/374012/Pro-Audio-Recording/PA-Speaker-Cabinets/Mackie/Thump212XT-Enhanced-Powered-Loudspeaker.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/mackie-thump212xt-12-inch-1400w-enhanced-fd0eb9a7.jpg"
fi

# QSC KS118 18 Inch 3600W Powered Subwoofer
echo "Downloading qsc-ks118-18-inch-3600w-powered-subwoofe-500757fa..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/132458/Pro-Audio-Recording/PA-Speaker-Cabinets/QSC/KS118-18-Inch-Powered-Subwoofer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/qsc-ks118-18-inch-3600w-powered-subwoofe-500757fa.jpg"
fi

# Shure SM58 Unidirectional/Cardioid Dynamic Microphone
echo "Downloading shure-sm58-unidirectional-cardioid-dynam-108d6a43..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/1093/Pro-Audio-Recording/Microphones-Vocal-Processors/Shure/SM58-Unidirectional-Cardioid-Dynamic-Microphone.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/shure-sm58-unidirectional-cardioid-dynam-108d6a43.jpg"
fi

# Shure SM57 Instrument Microphone
echo "Downloading shure-sm57-instrument-microphone-377f6b98..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/1092/Pro-Audio-Recording/Microphones-Vocal-Processors/Shure/SM57-Instrument-Microphone.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/shure-sm57-instrument-microphone-377f6b98.jpg"
fi

# Sennheiser e835 Evolution Handheld Cardioid Microphone
echo "Downloading sennheiser-e835-evolution-handheld-cardi-39d6e964..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/4741/Pro-Audio-Recording/Microphones-Vocal-Processors/Sennheiser/e835-Cardioid-Dynamic-Microphone.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/sennheiser-e835-evolution-handheld-cardi-39d6e964.jpg"
fi

# Sennheiser EW 112-P G4-A Portable Lavalier Set
echo "Downloading sennheiser-ew-112-p-g4-a-portable-lavali-55f05d67..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/111871/Pro-Audio-Recording/Wireless-Systems/Sennheiser/EW-112P-G4-A-Portable-Lavalier-Set.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/sennheiser-ew-112-p-g4-a-portable-lavali-55f05d67.jpg"
fi

# Shure BLX288/PG58 Dual Channel Handheld Wireless System
echo "Downloading shure-blx288-pg58-dual-channel-handheld--8c5c4640..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/78934/Pro-Audio-Recording/Wireless-Systems/Shure/BLX288-PG58-Dual-Channel-Handheld-Wireless-System.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/shure-blx288-pg58-dual-channel-handheld--8c5c4640.jpg"
fi

# Shure GLXD14+/85 Digital Wireless Lavalier System
echo "Downloading shure-glxd14-85-digital-wireless-lavalie-dbfec564..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/345289/Pro-Audio-Recording/Wireless-Systems/Shure/GLXD14-Plus-85-Digital-Wireless-Lavalier-System.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/shure-glxd14-85-digital-wireless-lavalie-dbfec564.jpg"
fi

# Audio-Technica AT2020 Cardioid Condenser Microphone
echo "Downloading audio-technica-at2020-cardioid-condenser-603594ec..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/11243/Pro-Audio-Recording/Microphones-Vocal-Processors/Audio-Technica/AT2020-Cardioid-Condenser-Microphone.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/audio-technica-at2020-cardioid-condenser-603594ec.jpg"
fi

# Sennheiser XSW 1-835-A Wireless Handheld Microphone System
echo "Downloading sennheiser-xsw-1-835-a-wireless-handheld-e63bb963..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/130457/Pro-Audio-Recording/Wireless-Systems/Sennheiser/XSW-1-835-A-Wireless-Handheld-System.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/sennheiser-xsw-1-835-a-wireless-handheld-e63bb963.jpg"
fi

# Shure CVB-B/O Omnidirectional Installed Boundary Microphone
echo "Downloading shure-cvb-b-o-omnidirectional-installed--296113eb..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/189132/Pro-Audio-Recording/Microphones-Vocal-Processors/Shure/CVB-B-O-Omnidirectional-Installed-Boundary-Microphone-with-12ft-Cable-Black.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/shure-cvb-b-o-omnidirectional-installed--296113eb.jpg"
fi

# AKG P220 Large Diaphragm Condenser Microphone
echo "Downloading akg-p220-large-diaphragm-condenser-micro-0e2213a0..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/61287/Pro-Audio-Recording/Microphones-Vocal-Processors/AKG/P220-Large-Diaphragm-Condenser-Microphone.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/akg-p220-large-diaphragm-condenser-micro-0e2213a0.jpg"
fi

# Mackie ProFX16v3 16-Channel Professional Effects Mixer
echo "Downloading mackie-profx16v3-16-channel-professional-75b2a454..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/148553/Pro-Audio-Recording/Mixers/Mackie/ProFX16v3-16-Channel-Professional-Effects-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/mackie-profx16v3-16-channel-professional-75b2a454.jpg"
fi

# Yorkville 8-Channel Passive Mixer
echo "Downloading yorkville-8-channel-passive-mixer-8db0c6cb..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/17950/Pro-Audio-Recording/Mixers/Yorkville-Sound/8-Channel-Passive-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/yorkville-8-channel-passive-mixer-8db0c6cb.jpg"
fi

# Yorkville 14-Channel Compact Desk Mixer
echo "Downloading yorkville-14-channel-compact-desk-mixer-fc124744..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/20283/Pro-Audio-Recording/Mixers/Yorkville-Sound/14-Channel-Compact-Desk-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/yorkville-14-channel-compact-desk-mixer-fc124744.jpg"
fi

# Allen & Heath ZED-12FX 12-Channel Mixer with Effects
echo "Downloading allen--heath-zed-12fx-12-channel-mixer-w-c0e6eeb8..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/42367/Pro-Audio-Recording/Mixers/Allen-Heath/ZED-12FX-12-Channel-Mixer-with-Effects.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/allen--heath-zed-12fx-12-channel-mixer-w-c0e6eeb8.jpg"
fi

# Yamaha MG20XU 20-Channel Mixer with Effects and USB
echo "Downloading yamaha-mg20xu-20-channel-mixer-with-effe-edf4cf5e..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/82314/Pro-Audio-Recording/Mixers/Yamaha/MG20XU-20-Channel-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/yamaha-mg20xu-20-channel-mixer-with-effe-edf4cf5e.jpg"
fi

# Yorkville 24 Channel x 4 XLR Returns - 100 foot
echo "Downloading yorkville-24-channel-x-4-xlr-returns---1-5ae672f8..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/4377/Pro-Audio-Recording/Cables/Yorkville-Sound/24-Channel-x-4-XLR-Returns-100-foot.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/yorkville-24-channel-x-4-xlr-returns---1-5ae672f8.jpg"
fi

# Radial ProDI Passive Direct Box
echo "Downloading radial-prodi-passive-direct-box-8bcefe74..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/42189/Pro-Audio-Recording/Direct-Boxes/Radial-Engineering/ProDI-Passive-Direct-Box.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/radial-prodi-passive-direct-box-8bcefe74.jpg"
fi

# Furman M-8x2 Merit Series 8 Outlet Power Conditioner
echo "Downloading furman-m-8x2-merit-series-8-outlet-power-f1973990..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/14278/Pro-Audio-Recording/Power-Conditioners/Furman/M-8x2-Merit-Series-Power-Conditioner.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/furman-m-8x2-merit-series-8-outlet-power-f1973990.jpg"
fi

# Behringer Powerplay P16-M 16-Channel Digital Personal Mixer
echo "Downloading behringer-powerplay-p16-m-16-channel-dig-cbcd1647..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/67234/Pro-Audio-Recording/Mixers/Behringer/Powerplay-P16-M-Personal-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/behringer-powerplay-p16-m-16-channel-dig-cbcd1647.jpg"
fi

# Epson PowerLite 2140W WXGA 3LCD Projector
echo "Downloading epson-powerlite-2140w-wxga-3lcd-projecto-8597512d..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/84242/Pro-Audio-Recording/Lighting/Epson/PowerLite-2140W-WXGA-3LCD-Projector.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/epson-powerlite-2140w-wxga-3lcd-projecto-8597512d.jpg"
fi

# Grandview 80 Inch X-Press Pull-Up Projector Screen
echo "Downloading grandview-80-inch-x-press-pull-up-projec-26ebcdb2..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/65781/Pro-Audio-Recording/Lighting/Grandview/80-Inch-X-Press-Pull-Up-Projector-Screen.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/grandview-80-inch-x-press-pull-up-projec-26ebcdb2.jpg"
fi

# Grandview Cyber X-Press Series Pull-Up Projector Screen - 92"
echo "Downloading grandview-cyber-x-press-series-pull-up-p-91a40488..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/65782/Pro-Audio-Recording/Lighting-Fog-Machines/Grandview/92-Inch-X-Press-Pull-Up-Projector-Screen.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/grandview-cyber-x-press-series-pull-up-p-91a40488.jpg"
fi

# Zoom Q8N Handheld 4K Video and Audio Recorder
echo "Downloading zoom-q8n-handheld-4k-video-and-audio-rec-70803a95..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/274011/Pro-Audio-Recording/Video/Zoom/Q8N-4K-Handheld-4K-Audio-and-Video-Recorder.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/zoom-q8n-handheld-4k-video-and-audio-rec-70803a95.jpg"
fi

# Epson PowerLite 1795F Full HD Wireless 3LCD Projector
echo "Downloading epson-powerlite-1795f-full-hd-wireless-3-7aa16743..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/105673/Pro-Audio-Recording/Lighting/Epson/PowerLite-1795F-Full-HD-Wireless-Projector.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/epson-powerlite-1795f-full-hd-wireless-3-7aa16743.jpg"
fi

# Chauvet DJ SlimPAR Pro H USB RGBAW+UV LED Wash Light
echo "Downloading chauvet-dj-slimpar-pro-h-usb-rgbawuv-led-b183691a..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/134567/Pro-Audio-Recording/Lighting/Chauvet-DJ/SlimPAR-Pro-H-USB-RGBAW-UV-LED-Wash-Light.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/chauvet-dj-slimpar-pro-h-usb-rgbawuv-led-b183691a.jpg"
fi

# ADJ Mega HEX Par RGBAW+UV LED Par Light
echo "Downloading adj-mega-hex-par-rgbawuv-led-par-light-3f4a012a..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/98734/Pro-Audio-Recording/Lighting/American-DJ/Mega-HEX-Par-RGBAW-UV-LED-Par.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/adj-mega-hex-par-rgbawuv-led-par-light-3f4a012a.jpg"
fi

# Chauvet Intimidator Spot 360 LED Moving Head
echo "Downloading chauvet-intimidator-spot-360-led-moving--286ab1e3..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/187234/Pro-Audio-Recording/Lighting/Chauvet-DJ/Intimidator-Spot-360-LED-Moving-Head.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/chauvet-intimidator-spot-360-led-moving--286ab1e3.jpg"
fi

# Chauvet DJ Hurricane Haze 2D Water-Based Hazer
echo "Downloading chauvet-dj-hurricane-haze-2d-water-based-819e554c..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/156789/Pro-Audio-Recording/Lighting-Fog-Machines/Chauvet-DJ/Hurricane-Haze-2D-Hazer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/chauvet-dj-hurricane-haze-2d-water-based-819e554c.jpg"
fi

# ADJ Fog Storm 1200HD Fog Machine
echo "Downloading adj-fog-storm-1200hd-fog-machine-06ede041..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/112456/Pro-Audio-Recording/Lighting-Fog-Machines/American-DJ/Fog-Storm-1200HD-Fog-Machine.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/adj-fog-storm-1200hd-fog-machine-06ede041.jpg"
fi

# Chauvet DJ GigBAR Move 5-in-1 Lighting System
echo "Downloading chauvet-dj-gigbar-move-5-in-1-lighting-s-eb6c6ad6..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/298456/Pro-Audio-Recording/Lighting/Chauvet-DJ/GigBAR-Move-5-in-1-Lighting-System.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/chauvet-dj-gigbar-move-5-in-1-lighting-s-eb6c6ad6.jpg"
fi

# ADJ Ultra Bar 12H RGBAW+UV LED Linear Fixture
echo "Downloading adj-ultra-bar-12h-rgbawuv-led-linear-fix-89722675..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/167890/Pro-Audio-Recording/Lighting/American-DJ/Ultra-Bar-12H-RGBAW-UV-LED-Linear-Fixture.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/adj-ultra-bar-12h-rgbawuv-led-linear-fix-89722675.jpg"
fi

# Chauvet DJ Obey 70 DMX Controller
echo "Downloading chauvet-dj-obey-70-dmx-controller-1b16c4f1..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/89012/Pro-Audio-Recording/Lighting/Chauvet-DJ/Obey-70-DMX-Controller.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/chauvet-dj-obey-70-dmx-controller-1b16c4f1.jpg"
fi

# ADJ Lighting Stand Package with T-Bar
echo "Downloading adj-lighting-stand-package-with-t-bar-04196256..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/56789/Pro-Audio-Recording/Lighting/American-DJ/Lighting-Stand-Package-T-Bar.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/adj-lighting-stand-package-with-t-bar-04196256.jpg"
fi

# Pioneer DDJ-FLX6 4-Channel DJ Controller
echo "Downloading pioneer-ddj-flx6-4-channel-dj-controller-29b659a7..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/310234/Pro-Audio-Recording/DJ-Equipment/Pioneer-DJ/DDJ-FLX6-4-Channel-DJ-Controller.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/pioneer-ddj-flx6-4-channel-dj-controller-29b659a7.jpg"
fi

# Pioneer CDJ-2000NXS2 Professional Multi Player
echo "Downloading pioneer-cdj-2000nxs2-professional-multi--44828105..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/98765/Pro-Audio-Recording/DJ-Equipment/Pioneer-DJ/CDJ-2000NXS2-Professional-Multi-Player.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/pioneer-cdj-2000nxs2-professional-multi--44828105.jpg"
fi

# Pioneer DJM-900NXS2 4-Channel Professional DJ Mixer
echo "Downloading pioneer-djm-900nxs2-4-channel-profession-48ace0a2..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/98766/Pro-Audio-Recording/DJ-Equipment/Pioneer-DJ/DJM-900NXS2-Professional-DJ-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/pioneer-djm-900nxs2-4-channel-profession-48ace0a2.jpg"
fi

# Pioneer DDJ-1000 4-Channel Performance DJ Controller
echo "Downloading pioneer-ddj-1000-4-channel-performance-d-04b9159f..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/145678/Pro-Audio-Recording/DJ-Equipment/Pioneer-DJ/DDJ-1000-Performance-DJ-Controller.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/pioneer-ddj-1000-4-channel-performance-d-04b9159f.jpg"
fi

# Technics SL-1200MK7 Direct Drive Turntable
echo "Downloading technics-sl-1200mk7-direct-drive-turntab-d4722e38..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/234567/Pro-Audio-Recording/DJ-Equipment/Technics/SL-1200MK7-Direct-Drive-Turntable.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/technics-sl-1200mk7-direct-drive-turntab-d4722e38.jpg"
fi

# Pioneer DJM-V10 6-Channel Professional DJ Mixer
echo "Downloading pioneer-djm-v10-6-channel-professional-d-2bb750d3..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/310567/Pro-Audio-Recording/DJ-Equipment/Pioneer-DJ/DJM-V10-6-Channel-Professional-DJ-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/pioneer-djm-v10-6-channel-professional-d-2bb750d3.jpg"
fi

# Pioneer DJM-A9 4-Channel Professional DJ Mixer
echo "Downloading pioneer-djm-a9-4-channel-professional-dj-6caa4870..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/378901/Pro-Audio-Recording/DJ-Equipment/Pioneer-DJ/DJM-A9-4-Channel-Professional-DJ-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/pioneer-djm-a9-4-channel-professional-dj-6caa4870.jpg"
fi

# Pioneer DJM-S11 Professional 2-Channel DJ Mixer
echo "Downloading pioneer-djm-s11-professional-2-channel-d-1d8e716c..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/345012/Pro-Audio-Recording/DJ-Equipment/Pioneer-DJ/DJM-S11-Professional-2-Channel-DJ-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/pioneer-djm-s11-professional-2-channel-d-1d8e716c.jpg"
fi

# Rane ONE Professional Motorized DJ Controller
echo "Downloading rane-one-professional-motorized-dj-contr-aab4334a..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/356789/Pro-Audio-Recording/DJ-Equipment/Rane/ONE-Professional-Motorized-DJ-Controller.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/rane-one-professional-motorized-dj-contr-aab4334a.jpg"
fi

# Rane SEVENTY-TWO MKII Premium 2-Channel Mixer
echo "Downloading rane-seventy-two-mkii-premium-2-channel--da022aff..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/367890/Pro-Audio-Recording/DJ-Equipment/Rane/SEVENTY-TWO-MKII-Premium-2-Channel-Mixer.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/rane-seventy-two-mkii-premium-2-channel--da022aff.jpg"
fi

# Rane TWELVE MKII 12-Inch Motorized Turntable Controller
echo "Downloading rane-twelve-mkii-12-inch-motorized-turnt-c033ff3f..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/378012/Pro-Audio-Recording/DJ-Equipment/Rane/TWELVE-MKII-12-Inch-Motorized-Turntable-Controller.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/rane-twelve-mkii-12-inch-motorized-turnt-c033ff3f.jpg"
fi

# Pioneer CDJ-3000 Professional DJ Multi Player
echo "Downloading pioneer-cdj-3000-professional-dj-multi-p-cef10c88..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/389012/Pro-Audio-Recording/DJ-Equipment/Pioneer-DJ/CDJ-3000-Professional-DJ-Multi-Player.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/pioneer-cdj-3000-professional-dj-multi-p-cef10c88.jpg"
fi

# Pioneer DDJ-REV7 Scratch-Style 2-Channel DJ Controller
echo "Downloading pioneer-ddj-rev7-scratch-style-2-channel-a57f7f3b..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/390123/Pro-Audio-Recording/DJ-Equipment/Pioneer-DJ/DDJ-REV7-Scratch-Style-2-Channel-Controller.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/pioneer-ddj-rev7-scratch-style-2-channel-a57f7f3b.jpg"
fi

# Rane FOUR Advanced 4-Channel Stems DJ Controller
echo "Downloading rane-four-advanced-4-channel-stems-dj-co-2f2b8fea..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/401234/Pro-Audio-Recording/DJ-Equipment/Rane/FOUR-Advanced-4-Channel-Stems-Controller.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/rane-four-advanced-4-channel-stems-dj-co-2f2b8fea.jpg"
fi

# Fender '65 Twin Reverb Reissue Guitar Amplifier
echo "Downloading fender-65-twin-reverb-reissue-guitar-amp-49db9114..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/34567/Guitars/Amplifiers/Fender/65-Twin-Reverb-Reissue-Guitar-Amplifier.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/fender-65-twin-reverb-reissue-guitar-amp-49db9114.jpg"
fi

# Marshall JCM800 2203 100W Tube Head
echo "Downloading marshall-jcm800-2203-100w-tube-head-46ad8b23..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/45678/Guitars/Amplifiers/Marshall/JCM800-2203-100W-Tube-Head.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/marshall-jcm800-2203-100w-tube-head-46ad8b23.jpg"
fi

# Ampeg SVT-CL Classic 300W All-Tube Bass Head
echo "Downloading ampeg-svt-cl-classic-300w-all-tube-bass--62bcd956..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/56789/Bass/Amplifiers/Ampeg/SVT-CL-Classic-300W-Bass-Head.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/ampeg-svt-cl-classic-300w-all-tube-bass--62bcd956.jpg"
fi

# Ampeg SVT-810E 8x10 Bass Cabinet
echo "Downloading ampeg-svt-810e-8x10-bass-cabinet-3852febb..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/56790/Bass/Amplifiers/Ampeg/SVT-810E-8x10-Bass-Cabinet.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/ampeg-svt-810e-8x10-bass-cabinet-3852febb.jpg"
fi

# Nord Stage 3 88 Weighted Key Stage Keyboard
echo "Downloading nord-stage-3-88-weighted-key-stage-keybo-598dc945..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/123456/Keyboards/Stage-Pianos/Nord/Stage-3-88-Weighted-Keyboard.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/nord-stage-3-88-weighted-key-stage-keybo-598dc945.jpg"
fi

# Yamaha CP88 Stage Piano
echo "Downloading yamaha-cp88-stage-piano-488133dd..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/178923/Keyboards/Stage-Pianos/Yamaha/CP88-Stage-Piano.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/yamaha-cp88-stage-piano-488133dd.jpg"
fi

# Roland RD-2000 Stage Piano
echo "Downloading roland-rd-2000-stage-piano-411e4550..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/134789/Keyboards/Stage-Pianos/Roland/RD-2000-Stage-Piano.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/roland-rd-2000-stage-piano-411e4550.jpg"
fi

# DW Collector's Series 5-Piece Drum Kit
echo "Downloading dw-collectors-series-5-piece-drum-kit-e52f5c84..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/67890/Drums/Acoustic-Drums/DW/Collectors-Series-5-Piece-Drum-Kit.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/dw-collectors-series-5-piece-drum-kit-e52f5c84.jpg"
fi

# Roland TD-17KVX V-Drums Electronic Drum Kit
echo "Downloading roland-td-17kvx-v-drums-electronic-drum--bbffe8c0..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/145678/Drums/Electronic-Drums/Roland/TD-17KVX-V-Drums-Electronic-Kit.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/roland-td-17kvx-v-drums-electronic-drum--bbffe8c0.jpg"
fi

# Fender Deluxe Reverb '68 Custom Guitar Amplifier
echo "Downloading fender-deluxe-reverb-68-custom-guitar-am-bb57ac95..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/87654/Guitars/Amplifiers/Fender/68-Custom-Deluxe-Reverb.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/fender-deluxe-reverb-68-custom-guitar-am-bb57ac95.jpg"
fi

# Keyboard X-Stand Double Braced
echo "Downloading keyboard-x-stand-double-braced-4d1cb338..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/23456/Keyboards/Stands/On-Stage/Keyboard-X-Stand-Double-Braced.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/keyboard-x-stand-double-braced-4d1cb338.jpg"
fi

# Focusrite Scarlett 18i20 3rd Gen USB Audio Interface
echo "Downloading focusrite-scarlett-18i20-3rd-gen-usb-aud-cb967d69..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/156234/Pro-Audio-Recording/Audio-Interfaces/Focusrite/Scarlett-18i20-3rd-Gen-USB-Interface.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/focusrite-scarlett-18i20-3rd-gen-usb-aud-cb967d69.jpg"
fi

# Yamaha HS8 8-Inch Powered Studio Monitor (Pair)
echo "Downloading yamaha-hs8-8-inch-powered-studio-monitor-dd02c429..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/45612/Pro-Audio-Recording/Studio-Monitors/Yamaha/HS8-Powered-Studio-Monitor.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/yamaha-hs8-8-inch-powered-studio-monitor-dd02c429.jpg"
fi

# Beyerdynamic DT 770 Pro 250 Ohm Studio Headphones
echo "Downloading beyerdynamic-dt-770-pro-250-ohm-studio-h-61df4ce5..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/78901/Pro-Audio-Recording/Headphones/Beyerdynamic/DT-770-Pro-250-Ohm-Headphones.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/beyerdynamic-dt-770-pro-250-ohm-studio-h-61df4ce5.jpg"
fi

# Focusrite Scarlett 2i2 3rd Gen USB Audio Interface
echo "Downloading focusrite-scarlett-2i2-3rd-gen-usb-audio-b9ed36cb..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/156235/Pro-Audio-Recording/Audio-Interfaces/Focusrite/Scarlett-2i2-3rd-Gen-USB-Interface.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/focusrite-scarlett-2i2-3rd-gen-usb-audio-b9ed36cb.jpg"
fi

# KRK ROKIT 5 G4 5-Inch Powered Studio Monitor (Pair)
echo "Downloading krk-rokit-5-g4-5-inch-powered-studio-mon-73721159..."
IMG_URL=$(curl -sL "https://www.long-mcquade.com/167234/Pro-Audio-Recording/Studio-Monitors/KRK/ROKIT-5-G4-Powered-Monitor.htm" | grep -oP '(?:og:image|product-image).*?content="\K[^"]+|src="(https://[^"]*(?:large|1024|product)[^"]*\.(?:jpg|png|webp))' | head -1)
if [ -n "$IMG_URL" ]; then
  curl -sL "$IMG_URL" -o "public/products/krk-rokit-5-g4-5-inch-powered-studio-mon-73721159.jpg"
fi
