
(function() {
    // Check if the current URL contains the target event ID
    if (window.location.href.includes('22222')) {
        
        // 1. Inject the new font (Outfit)
        const fontLink = document.createElement('link');
        fontLink.href = 'https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700&display=swap';
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);

        // 2. Move the Date under the Title and make Description Full Width
        setTimeout(function() {
            const titleEl = document.querySelector('.event_name');
            const dateLink = document.querySelector('.ical_link');
            const eventInfoCol = document.querySelector('.column2');

            if (titleEl && dateLink) {
                // Move the date directly under the title
                titleEl.insertAdjacentElement('afterend', dateLink);
                
                // Style the moved date badge
                dateLink.style.display = 'inline-block';
                dateLink.style.marginBottom = '25px';
                dateLink.style.padding = '8px 16px';
                dateLink.style.backgroundColor = '#fcfbf9';
                dateLink.style.border = '1px solid #baa797';
                dateLink.style.borderRadius = '6px';
                dateLink.style.fontSize = '15px';
                dateLink.style.fontWeight = '600';
                
                // Hide the old side column box completely
                if (eventInfoCol) eventInfoCol.style.display = 'none';
            }
        }, 100);

        // 3. Define the custom CSS
        const customCSS = `
            /* =========================================
               Global Font & Outer Background
               ========================================= */
            body, .body_wrapper, #co_body_container, #cco_body, input, select, textarea, button, .event_description, .form-section * {
                font-family: 'Outfit', sans-serif !important;
            }

* {font-family:"Outfit" !important;}
            
            body, .body_wrapper, #co_body_container, #cco_body {
                background-color: #baa797 !important; /* Warm grey background */
            }

            /* =========================================
               Main Form Container - Pure White
               ========================================= */
            #RegisterSinglePage {
                background-color: #ffffff !important;
                border-radius: 12px !important;
                box-shadow: 0 10px 40px rgba(6, 47, 51, 0.2) !important;
                padding: 50px !important;
                border: none !important;
                max-width: 900px !important;
                margin: 40px auto !important;
                box-sizing: border-box !important;
            }

            /* =========================================
               Text Areas & Headers (Full Width Fix)
               ========================================= */
            .column1 { width: 100% !important; float: none !important; }

            .event_description, .content-area-parent, #RegisterHeader {
                background-color: transparent !important; 
                color: #062f33 !important;
                line-height: 1.7 !important;
            }

            h1, h2, h3, .heading, .title, .bold, strong, .label {
                color: #062f33 !important;
                font-weight: 700 !important;
            }
            
            .event_name {
                font-size: 32px !important;
                color: #062f33 !important;
                margin-bottom: 15px !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
                display: block !important;
            }

            /* =========================================
               Sponsorship Cards (Replaces Radio/Checkboxes)
               ========================================= */
            /* Clean up the title */
            .form-label-left label {
                font-size: 20px !important;
                font-weight: 700 !important;
                color: #062f33 !important;
                margin-bottom: 15px !important;
                display: block !important;
            }

            /* Create a CSS Grid for the cards */
            .form-multiple-column {
                display: grid !important;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)) !important;
                gap: 15px !important;
                width: 100% !important;
            }

            /* Hide ugly clearfixes injected by Jotform */
            .form-multiple-column .clearfix { display: none !important; }

            /* Visually hide the actual checkboxes */
            .form-checkbox-item input[type="checkbox"] {
                position: absolute !important;
                opacity: 0 !important;
                cursor: pointer !important;
            }

            /* Style the labels (and the 'Other' span) to look like cards */
            .form-checkbox-item label,
            .form-checkbox-item input.form-checkbox-other + span {
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                width: 100% !important;
                box-sizing: border-box !important;
                padding: 15px !important;
                border: 2px solid #e0d8d0 !important;
                border-radius: 8px !important;
                background-color: #faf9f7 !important;
                color: #062f33 !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                text-align: center !important;
                min-height: 65px !important;
            }

            /* Hover State */
            .form-checkbox-item label:hover,
            .form-checkbox-item input.form-checkbox-other:not(:checked) + span:hover {
                border-color: #d1b482 !important;
                background-color: #ffffff !important;
                box-shadow: 0 4px 15px rgba(209, 180, 130, 0.2) !important;
            }

            /* Checked State (Changes to Deep Teal) */
            .form-checkbox-item input[type="checkbox"]:checked + label,
            .form-checkbox-item input.form-checkbox-other:checked + span {
                background-color: #062f33 !important;
                border-color: #062f33 !important;
                color: #ffffff !important;
                box-shadow: 0 4px 15px rgba(6, 47, 51, 0.3) !important;
            }

            .form-checkbox-item input[type="checkbox"]:checked + label span {
                color: #ffffff !important;
            }

            /* Specifically fix the "Other" text input field */
            .form-checkbox-other-input {
                width: 100% !important;
                padding: 8px 12px !important;
                border: none !important;
                border-bottom: 2px solid #baa797 !important;
                border-radius: 0 !important;
                background-color: transparent !important;
                font-family: 'Outfit', sans-serif !important;
                font-size: 15px !important;
                color: inherit !important;
                text-align: center !important;
                transition: border-color 0.3s ease !important;
                box-shadow: none !important;
            }
            
            .form-checkbox-other-input:focus {
                border-bottom-color: #d1b482 !important;
                outline: none !important;
                background-color: transparent !important;
            }

            /* Make "Other" text input white when the card is selected */
            .form-checkbox-item input.form-checkbox-other:checked + span .form-checkbox-other-input {
                color: #ffffff !important;
                border-bottom-color: #ffffff !important;
            }
            .form-checkbox-item input.form-checkbox-other:checked + span .form-checkbox-other-input::placeholder {
                color: rgba(255,255,255,0.7) !important;
            }

            /* =========================================
               Ticket Reservation Rows
               ========================================= */
            .reservations > .clearfix.medium_top_margin,
            .reservation .clearfix.medium_vertical_padding {
                display: flex !important;
                flex-wrap: nowrap !important; 
                align-items: center !important;
                width: 100% !important;
                gap: 15px !important;
                padding: 10px 0 !important;
            }
            
            .reservation {
                background: #fcfbf9 !important;
                border-radius: 8px !important;
                padding: 10px 20px !important;
                border: 1px solid #e0d8d0 !important;
                margin-bottom: 10px !important;
            }

            .reservations .g20, .reservation .g20 { flex: 0 0 20px !important; width: auto !important; float: none !important; margin: 0 !important; }
            .reservations .g120, .reservation .g120 { flex: 1 1 40% !important; width: auto !important; float: none !important; margin: 0 !important; } 
            .reservations .g140, .reservation .g140 { flex: 1 1 40% !important; width: auto !important; float: none !important; margin: 0 !important; } 
            .reservations .g100, .reservation .g100 { flex: 0 0 100px !important; width: auto !important; float: none !important; margin: 0 !important; } 
            .reservations .g40, .reservation .g40 { flex: 0 0 40px !important; width: auto !important; float: none !important; margin: 0 !important; } 
            .price-display, .price-header { flex: 0 0 70px !important; text-align: right !important; float: none !important; margin: 0 !important; }

            .remove_reservation {
                background-color: #baa797 !important;
                color: white !important;
                border: none !important;
                border-radius: 50% !important;
                width: 30px !important;
                height: 30px !important;
                font-size: 18px !important;
                line-height: 1 !important;
                cursor: pointer !important;
                display: flex !important;
                align-items: center !important;
                justify-content: center !important;
                transition: background 0.2s !important;
            }
            .remove_reservation:hover { background-color: #d93838 !important; }

            /* =========================================
               General Form Layout (Labels & Inputs)
               ========================================= */
            #ReserversInformation .clearfix.small_vertical_padding,
            #Payment .clearfix.small_vertical_padding {
                display: flex !important;
                flex-wrap: wrap !important;
                align-items: center !important;
                margin-bottom: 15px !important;
            }

            .label.g140.ml140 {
                margin-left: 0 !important;
                width: auto !important;
                flex: 0 0 160px !important;
                padding-right: 20px !important;
                text-align: right !important;
                font-size: 14px !important;
            }

            .float_left.left_margin {
                margin-left: 0 !important;
                flex: 1 1 auto !important;
                max-width: 500px !important;
            }

            /* =========================================
               Inputs & Selects Design
               ========================================= */
            .co_form_input, input[type="text"], input[type="email"], input[type="tel"], input[type="number"], select, textarea {
                width: 100% !important;
                box-sizing: border-box !important;
                padding: 12px 16px !important;
                border: 2px solid #e0d8d0 !important;
                border-radius: 6px !important;
                background-color: #faf9f7 !important;
                color: #062f33 !important;
                font-size: 15px !important;
                transition: all 0.3s ease !important;
            }

            .co_form_input:focus, input:focus, select:focus, textarea:focus {
                border-color: #d1b482 !important;
                background-color: #ffffff !important;
                box-shadow: 0 0 0 4px rgba(209, 180, 130, 0.15) !important; 
                outline: none !important;
            }

            #PaymentCardExpirationMonth { width: 48% !important; float: left !important; }
            #PaymentCardExpirationYear { width: 48% !important; float: right !important; }

            /* =========================================
               Buttons & Totals
               ========================================= */
            .button, button, .co_global_button button, #SubmitButton {
                background-color: #062f33 !important;
                color: white !important;
                border: none !important;
                padding: 16px 32px !important;
                border-radius: 8px !important;
                font-weight: 600 !important;
                font-size: 16px !important;
                cursor: pointer !important;
                transition: all 0.3s ease !important;
                text-transform: uppercase !important;
                letter-spacing: 1px !important;
            }

            .button:hover, button:hover, .co_global_button button:hover, #SubmitButton:hover {
                background-color: #d1b482 !important;
                color: #062f33 !important;
            }
            
            #SubmitButton:disabled {
                background-color: #baa797 !important;
                cursor: not-allowed !important;
            }

            #Totals {
                background-color: #062f33 !important;
                color: white !important;
                padding: 25px !important;
                border-radius: 8px !important;
                font-size: 16px !important;
                min-width: 300px !important;
            }
            #Totals .bold { color: #d1b482 !important; font-size: 20px !important; }

            a { color: #d1b482 !important; text-decoration: none !important; font-weight: 600 !important; }
            a:hover { color: #062f33 !important; }

            .separator {
                border-bottom: 2px dashed #baa797 !important;
                margin: 40px 0 !important;
                opacity: 0.4;
            }
        `;

        // 4. Inject the CSS
        const styleTag = document.createElement('style');
        styleTag.type = 'text/css';
        styleTag.appendChild(document.createTextNode(customCSS));
        document.head.appendChild(styleTag);
    }
})();
