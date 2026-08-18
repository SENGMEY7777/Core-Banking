CREATE DATABASE banking;
USE banking;

-- =========================================================
-- DATABASE INITIALIZATION (MySQL 8.0+)
-- =========================================================

-- 1. USERS TABLE
CREATE TABLE users (
    user_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role ENUM('CUSTOMER', 'TELLER', 'ADMIN') NOT NULL,
    kyc_status ENUM('NOT_STARTED', 'PENDING', 'VERIFIED', 'REJECTED') NOT NULL DEFAULT 'NOT_STARTED',
    biometric_enabled BOOLEAN DEFAULT FALSE,
    status ENUM('ACTIVE', 'SUSPENDED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. USER_BIOMETRICS TABLE
CREATE TABLE user_biometrics (
    biometric_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    credential_id VARCHAR(512) UNIQUE NOT NULL,
    public_key TEXT NOT NULL,
    face_vector_hash TEXT NULL,
    device_name VARCHAR(100) NULL,
    device_id VARCHAR(255) UNIQUE NULL,
    sign_counter BIGINT NOT NULL DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_used_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_biometrics_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SELECT * FROM user_biometrics;

-- 3. KYC_VERIFICATIONS TABLE
CREATE TABLE kyc_verifications (
    kyc_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    document_type ENUM('PASSPORT', 'NATIONAL_ID', 'DRIVERS_LICENSE') NOT NULL,
    document_number_hash VARCHAR(255) NOT NULL,
    document_photo_hash VARCHAR(255) NOT NULL,
    live_face_scan_hash VARCHAR(255) NOT NULL,
    face_match_score DECIMAL(5, 2) NOT NULL,
    liveness_score DECIMAL(5, 2) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED') DEFAULT 'PENDING',
    reviewed_by_admin_id VARCHAR(36) NULL,
    rejection_reason TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP NULL DEFAULT NULL,
    CONSTRAINT fk_kyc_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_kyc_admin FOREIGN KEY (reviewed_by_admin_id) REFERENCES users(user_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. BIOMETRIC_AUDIT_LOGS TABLE
CREATE TABLE biometric_audit_logs (
    log_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    biometric_id VARCHAR(36) NULL,
    challenge_type ENUM('LOGIN', 'eKYC_CHECK', 'TXN_STEPUP_APPROVAL') NOT NULL,
    target_reference_id VARCHAR(36) NULL,
    match_score DECIMAL(5, 2) NULL,
    ip_address VARCHAR(45) NULL,
    user_agent TEXT NULL,
    status ENUM('SUCCESS', 'FAILED_MATCH', 'LIVENESS_FAILED') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bio_audit_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_bio_audit_biometric FOREIGN KEY (biometric_id) REFERENCES user_biometrics(biometric_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. SESSIONS TABLE
CREATE TABLE sessions (
    session_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    auth_method ENUM('PASSWORD', 'FACE_ID', 'HYBRID_MFA') NOT NULL,
    ip_address VARCHAR(45) NULL,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_sessions_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. ACCOUNTS TABLE
CREATE TABLE accounts (
    account_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    user_id VARCHAR(36) NOT NULL,
    account_number VARCHAR(32) UNIQUE NOT NULL,
    account_type ENUM('SAVINGS', 'CHECKING', 'WALLET') NOT NULL,
    balance DECIMAL(18, 4) NOT NULL DEFAULT 0.0000 CHECK (balance >= 0),
    locked_balance DECIMAL(18, 4) NOT NULL DEFAULT 0.0000 CHECK (locked_balance >= 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    status ENUM('ACTIVE', 'FROZEN', 'CLOSED') NOT NULL DEFAULT 'ACTIVE',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_accounts_user FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. TXN_LEDGER TABLE
CREATE TABLE txn_ledger (
    txn_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    from_account_id VARCHAR(36) NULL,
    to_account_id VARCHAR(36) NULL,
    amount DECIMAL(18, 4) NOT NULL CHECK (amount > 0),
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    txn_type ENUM('TRANSFER', 'DEPOSIT', 'WITHDRAWAL', 'FEE') NOT NULL,
    status ENUM('PENDING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    requires_biometric_auth BOOLEAN DEFAULT FALSE,
    biometric_approval_log_id VARCHAR(36) NULL,
    idempotency_key VARCHAR(255) UNIQUE NOT NULL,
    reference_note TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_txn_from_account FOREIGN KEY (from_account_id) REFERENCES accounts(account_id) ON DELETE SET NULL,
    CONSTRAINT fk_txn_to_account FOREIGN KEY (to_account_id) REFERENCES accounts(account_id) ON DELETE SET NULL,
    CONSTRAINT fk_txn_bio_log FOREIGN KEY (biometric_approval_log_id) REFERENCES biometric_audit_logs(log_id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. LEDGER_ENTRIES TABLE
CREATE TABLE ledger_entries (
    entry_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    txn_id VARCHAR(36) NOT NULL,
    account_id VARCHAR(36) NOT NULL,
    entry_type ENUM('DEBIT', 'CREDIT') NOT NULL,
    amount DECIMAL(18, 4) NOT NULL CHECK (amount > 0),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_entries_txn FOREIGN KEY (txn_id) REFERENCES txn_ledger(txn_id) ON DELETE CASCADE,
    CONSTRAINT fk_entries_account FOREIGN KEY (account_id) REFERENCES accounts(account_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. CHAIN_LOG TABLE
CREATE TABLE chain_log (
    block_id VARCHAR(36) PRIMARY KEY DEFAULT (UUID()),
    block_number BIGINT AUTO_INCREMENT UNIQUE NOT NULL,
    previous_hash VARCHAR(64) NOT NULL,
    merkle_root VARCHAR(64) NOT NULL,
    block_hash VARCHAR(64) UNIQUE NOT NULL,
    txn_count INT NOT NULL,
    block_signature TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    KEY (block_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. BLOCK_TRANSACTIONS TABLE
CREATE TABLE block_transactions (
    block_id VARCHAR(36) NOT NULL,
    txn_id VARCHAR(36) NOT NULL,
    position_in_block INT NOT NULL,
    merkle_proof TEXT NOT NULL,
    PRIMARY KEY (block_id, txn_id),
    CONSTRAINT fk_bt_block FOREIGN KEY (block_id) REFERENCES chain_log(block_id) ON DELETE CASCADE,
    CONSTRAINT fk_bt_txn FOREIGN KEY (txn_id) REFERENCES txn_ledger(txn_id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERIES
-- =========================================================
CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_txn_from ON txn_ledger(from_account_id);
CREATE INDEX idx_txn_to ON txn_ledger(to_account_id);
CREATE INDEX idx_ledger_entries_txn ON ledger_entries(txn_id);
CREATE INDEX idx_biometrics_user ON user_biometrics(user_id);



INSERT INTO users (
    email,
    password_hash,
    full_name,
    role,
    kyc_status,
    biometric_enabled,
    status
) VALUES (
    'admin@bank.example.com',
    '$2b$12$eImiTXuWVmgh2Bq54.8rUu2Y3h.cE9N4mF55kR3k2c9c5c9c5c9c',
    'System Administrator',
    'ADMIN',
    'VERIFIED',
    FALSE,
    'ACTIVE'
)
ON DUPLICATE KEY UPDATE
    password_hash = VALUES(password_hash),
    full_name = VALUES(full_name),
    role = VALUES(role),
    kyc_status = VALUES(kyc_status),
    biometric_enabled = VALUES(biometric_enabled),
    status = VALUES(status),
    updated_at = CURRENT_TIMESTAMP;

UPDATE users
SET password_hash = '$2b$12$jS1y6uMfA4u75qRZIbAAueJs5v8Ss7Rclzb7feyzbO/7IRLqFRO52'
WHERE email = 'admin@bank.example.com';
    
    
select * from users;