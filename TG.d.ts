declare namespace TG {
    interface WebApp {
        initData: string,
        initDataUnsafe: WebAppInitData,
        version: string,
        platform: string,
        colorScheme: "light" | "dark",
        themeParams: ThemeParams,
        isExpanded: boolean,
        viewportHeigth: number, //float
        /*
        The value of viewportStableHeight will be updated after all gestures and animations are completed
        and the Mini App reaches its final size
        */
        viewportStableHeight: number, //float
        headerColor: string,
        backgroundColor: string,
        /*
        True, if the confirmation dialog is enabled while the user is trying to close the Mini App.
        False, if the confirmation dialog is disabled.
        */
        isClosingConfirmationEnabled: boolean,
        BackButton: BackButton,
        MainButton: MainButton,
        SettingsButton: SettingsButton,
        HapticFeedback: HapticFeedback,
        CloudStorage: CloudStorage, 
        onEvent(eventType:Webapp.Event, eventHandler:Function);
        offEvent(eventType:Webapp.Event, eventHandler:Function);
        ready(): void,
        expand(): void,
        close(): void,
        showAlert(message: string, onClose?: Function)
    }
    interface WebAppUser {
        id: number; // A unique identifier for the user or bot. It has at most 52 significant bits, so a 64-bit integer or a double-precision float type is safe for storing this identifier.
        is_bot?: boolean; // Optional. True, if this user is a bot. Returns in the receiver field only.
        first_name: string; // First name of the user or bot.
        last_name?: string; // Optional. Last name of the user or bot.
        username?: string; // Optional. Username of the user or bot.
        language_code?: string; // Optional. IETF language tag of the user's language. Returns in user field only.
        is_premium?: true; // Optional. True, if this user is a Telegram Premium user.
        added_to_attachment_menu?: true; // Optional. True, if this user added the bot to the attachment menu.
        allows_write_to_pm?: true; // Optional. True, if this user allowed the bot to message them.
        photo_url?: string; // Optional. URL of the user’s profile photo. The photo can be in .jpeg or .svg formats. Only returned for Mini Apps launched from the attachment menu.
    }
    
    interface WebAppChat {
        // Define fields for WebAppChat based on your needs, if available
    }
    
    interface WebAppInitData {
        query_id?: string; // Optional. A unique identifier for the Mini App session, required for sending messages via the answerWebAppQuery method.
        user?: WebAppUser; // Optional. An object containing data about the current user.
        receiver?: WebAppUser; // Optional. An object containing data about the chat partner of the current user in the chat where the bot was launched via the attachment menu. Returned only for private chats and only for Mini Apps launched via the attachment menu.
        chat?: WebAppChat; // Optional. An object containing data about the chat where the bot was launched via the attachment menu. Returned for supergroups, channels and group chats – only for Mini Apps launched via the attachment menu.
        chat_type?: string; // Optional. Type of the chat from which the Mini App was opened. Can be either “sender” for a private chat with the user opening the link, “private”, “group”, “supergroup”, or “channel”. Returned only for Mini Apps launched from direct links.
        chat_instance?: string; // Optional. Global identifier, uniquely corresponding to the chat from which the Mini App was opened. Returned only for Mini Apps launched from a direct link.
        start_param?: string; // Optional. The value of the startattach parameter, passed via link. Only returned for Mini Apps when launched from the attachment menu via link.
        can_send_after?: number; // Optional. Time in seconds, after which a message can be sent via the answerWebAppQuery method.
        auth_date: number; // Unix time when the form was opened.
        hash: string; // A hash of all passed parameters, which the bot server can use to check their validity.
    }
    
    interface ThemeParams {
        bg_color?: string; // Optional. Background color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-bg-color).
        text_color?: string; // Optional. Main text color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-text-color).
        hint_color?: string; // Optional. Hint text color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-hint-color).
        link_color?: string; // Optional. Link color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-link-color).
        button_color?: string; // Optional. Button color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-button-color).
        button_text_color?: string; // Optional. Button text color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-button-text-color).
        secondary_bg_color?: string; // Optional. Bot API 6.1+ Secondary background color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-secondary-bg-color).
        header_bg_color?: string; // Optional. Bot API 7.0+ Header background color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-header-bg-color).
        accent_text_color?: string; // Optional. Bot API 7.0+ Accent text color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-accent-text-color).
        section_bg_color?: string; // Optional. Bot API 7.0+ Background color for the section in the #RRGGBB format. It is recommended to use this in conjunction with secondary_bg_color. Also available as the CSS variable var(--tg-theme-section-bg-color).
        section_header_text_color?: string; // Optional. Bot API 7.0+ Header text color for the section in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-section-header-text-color).
        subtitle_text_color?: string; // Optional. Bot API 7.0+ Subtitle text color in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-subtitle-text-color).
        destructive_text_color?: string; // Optional. Bot API 7.0+ Text color for destructive actions in the #RRGGBB format. Also available as the CSS variable var(--tg-theme-destructive-text-color).
    }
    interface CloudStorage {
        /**
         * Stores a value in the cloud storage using the specified key.
         * @param key - The key should contain 1-128 characters, only A-Z, a-z, 0-9, _ and - are allowed.
         * @param value - The value should contain 0-4096 characters.
         * @param callback - Optional callback function. In case of an error, the first argument will contain the error. In case of success, the first argument will be null and the second argument will be a boolean indicating whether the value was stored.
         * @returns {CloudStorage} - Returns the CloudStorage object for chaining.
         */
        setItem(key: string, value: string, callback?: (error: Error | null, success: boolean) => void): CloudStorage;
    
        /**
         * Receives a value from the cloud storage using the specified key.
         * @param key - The key should contain 1-128 characters, only A-Z, a-z, 0-9, _ and - are allowed.
         * @param callback - Callback function. In case of an error, the first argument will contain the error. In case of success, the first argument will be null and the value will be passed as the second argument.
         */
        getItem(key: string, callback: (error: Error | null, value: string | null) => void): void;
    
        /**
         * Receives values from the cloud storage using the specified keys.
         * @param keys - The keys should contain 1-128 characters, only A-Z, a-z, 0-9, _ and - are allowed.
         * @param callback - Callback function. In case of an error, the first argument will contain the error. In case of success, the first argument will be null and the values will be passed as the second argument.
         */
        getItems(keys: string[], callback: (error: Error | null, values: Record<string, string>) => void): void;
    
        /**
         * Removes a value from the cloud storage using the specified key.
         * @param key - The key should contain 1-128 characters, only A-Z, a-z, 0-9, _ and - are allowed.
         * @param callback - Optional callback function. In case of an error, the first argument will contain the error. In case of success, the first argument will be null and the second argument will be a boolean indicating whether the value was removed.
         * @returns {CloudStorage} - Returns the CloudStorage object for chaining.
         */
        removeItem(key: string, callback?: (error: Error | null, success: boolean) => void): CloudStorage;
    
        /**
         * Removes values from the cloud storage using the specified keys.
         * @param keys - The keys should contain 1-128 characters, only A-Z, a-z, 0-9, _ and - are allowed.
         * @param callback - Optional callback function. In case of an error, the first argument will contain the error. In case of success, the first argument will be null and the second argument will be a boolean indicating whether the values were removed.
         * @returns {CloudStorage} - Returns the CloudStorage object for chaining.
         */
        removeItems(keys: string[], callback?: (error: Error | null, success: boolean) => void): CloudStorage;
    
        /**
         * Receives the list of all keys stored in the cloud storage.
         * @param callback - Callback function. In case of an error, the first argument will contain the error. In case of success, the first argument will be null and the list of keys will be passed as the second argument.
         */
        getKeys(callback: (error: Error | null, keys: string[]) => void): void;
    }
}
