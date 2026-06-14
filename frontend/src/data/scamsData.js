import React from 'react';
import { CreditCard, Landmark, ShoppingBag, Briefcase, Bitcoin, Siren, Ticket, ShieldOff } from 'lucide-react';

export const scams_en = [
  {
    id: "upi-collect",
    name: "UPI Collect Fraud",
    icon: <CreditCard className="w-5 h-5" />,
    severity: "CRITICAL",
    color: "red",
    trigger: `"Accept this payment request to receive funds"`,
    metadata: { vector: "UPI Apps", avgLoss: "â‚¹15,000", target: "Sellers / Public" },
    steps: [
      { title: "The Hook", desc: "Scammer contacts you pretending to buy an item or send a refund." },
      { title: "The Bait", desc: "They send a UPI 'Collect Request' instead of sending money." },
      { title: "The Trap", desc: "You enter your UPI PIN thinking you are receiving money, but funds are instantly deducted." }
    ],
    redFlags: [
      "Request comes from an unknown/unverified number",
      "Creates extreme urgency to act immediately",
      "Requires UPI PIN to 'receive' money (PIN is only for sending)"
    ],
    whatToDo: "NEVER enter your UPI PIN to receive money. Decline the request and block the sender."
  },
  {
    id: "fake-kyc",
    name: "Fake KYC SMS",
    icon: <Landmark className="w-5 h-5" />,
    severity: "CRITICAL",
    color: "red",
    trigger: `"Your bank account will be blocked today"`,
    metadata: { vector: "SMS / WhatsApp", avgLoss: "â‚¹45,000", target: "Bank Customers" },
    steps: [
      { title: "The Hook", desc: "Fake SMS warns of imminent account block due to pending KYC." },
      { title: "The Bait", desc: "You panic and click the malicious link to 'update KYC' online." },
      { title: "The Trap", desc: "You enter banking credentials and OTP on a fake phishing site, giving them full access." }
    ],
    redFlags: [
      "SMS contains a random, unofficial link (e.g., bit.ly or random domains)",
      "Threatens immediate account block to cause panic",
      "Asks for sensitive info like OTP, CVV, or Aadhaar online"
    ],
    whatToDo: "Never click links in SMS. Call your bank directly using the official number on your debit card."
  },
  {
    id: "digital-arrest",
    name: "Digital Arrest / Fake Police",
    icon: <Siren className="w-5 h-5" />,
    severity: "CRITICAL",
    color: "red",
    trigger: `"Your Aadhaar is linked to money laundering"`,
    metadata: { vector: "Voice Call / Skype", avgLoss: "â‚¹5 Lakhs+", target: "Professionals" },
    steps: [
      { title: "The Hook", desc: "Automated call claims your FedEx parcel has illegal items (drugs/passports)." },
      { title: "The Bait", desc: "Transferred to fake 'Cyber Crime Police' via Skype/WhatsApp video call." },
      { title: "The Trap", desc: "Forced to transfer all savings to a 'secure RBI account' to verify innocence." }
    ],
    redFlags: [
      "Police officer is calling via Skype or WhatsApp",
      "Demands secrecy and forbids you from calling family",
      "Asks you to transfer money to a 'safe account' for verification"
    ],
    whatToDo: "Real police never interrogate via Skype or ask for money transfers. Disconnect immediately."
  },
  {
    id: "job-scam",
    name: "Task-Based Job Scam",
    icon: <Briefcase className="w-5 h-5" />,
    severity: "HIGH",
    color: "orange",
    trigger: `"Work from home, earn â‚¹5,000 daily"`,
    metadata: { vector: "Telegram / WhatsApp", avgLoss: "â‚¹85,000", target: "Job Seekers" },
    steps: [
      { title: "The Hook", desc: "Received unsolicited WhatsApp message for an easy YouTube liking job." },
      { title: "The Bait", desc: "You do tasks, see 'virtual' earnings, and even get paid a tiny initial amount." },
      { title: "The Trap", desc: "You are asked to pay 'pre-paid task fees' or 'tax' to withdraw the larger accumulated earnings." }
    ],
    redFlags: [
      "Unrealistic high salary for zero skills or basic clicking",
      "Communication shifts exclusively to Telegram groups",
      "You have to pay money to 'unlock' your salary"
    ],
    whatToDo: "Never pay money to get a job or withdraw earnings. Block the recruiter."
  },
  {
    id: "crypto-fraud",
    name: "Crypto Investment Fraud",
    icon: <Bitcoin className="w-5 h-5" />,
    severity: "CRITICAL",
    color: "red",
    trigger: `"Guaranteed 10x returns in 30 days"`,
    metadata: { vector: "Social Media", avgLoss: "â‚¹2.5 Lakhs", target: "Investors" },
    steps: [
      { title: "The Hook", desc: "Added to a VIP Telegram/WhatsApp group showing massive daily profits." },
      { title: "The Bait", desc: "Instructed to download a specific, unknown crypto exchange app." },
      { title: "The Trap", desc: "App shows huge fake gains, but when you try to withdraw, your account is frozen." }
    ],
    redFlags: [
      "Promises of 'guaranteed' or 'risk-free' astronomical returns",
      "Urged to download unverified APK files or unknown apps",
      "Platform is not registered with SEBI or RBI"
    ],
    whatToDo: "Only invest through globally recognized, verified, and legally compliant platforms."
  },
  {
    id: "olx-buyer",
    name: "Marketplace Overpay Scam",
    icon: <ShoppingBag className="w-5 h-5" />,
    severity: "HIGH",
    color: "orange",
    trigger: `"I'll send extra money via NEFT right now"`,
    metadata: { vector: "OLX / Marketplace", avgLoss: "â‚¹12,000", target: "Online Sellers" },
    steps: [
      { title: "The Hook", desc: "Scammer agrees to buy your listed item immediately without seeing it." },
      { title: "The Bait", desc: "Claims they overpaid by mistake and sends a fake SMS/screenshot of the payment." },
      { title: "The Trap", desc: "Sends a QR code and asks you to scan it to 'refund' the excess amount." }
    ],
    redFlags: [
      "Buyer agrees to pay instantly without negotiating or inspecting",
      "Sends fake payment confirmation SMS that didn't come from your bank",
      "Asks you to scan a QR code to 'receive' the payment"
    ],
    whatToDo: "Check your actual bank app statement, not SMS. Never scan a QR code to receive money."
  },
  {
    id: "fake-lottery",
    name: "KBC / Fake Lottery",
    icon: <Ticket className="w-5 h-5" />,
    severity: "HIGH",
    color: "orange",
    trigger: `"Congratulations! You won KBC â‚¹25 lakhs"`,
    metadata: { vector: "WhatsApp Audio", avgLoss: "â‚¹35,000", target: "Elderly / Rural" },
    steps: [
      { title: "The Hook", desc: "Receive a WhatsApp audio/image message claiming you won a massive lottery." },
      { title: "The Bait", desc: "Asked to call a specific 'Bank Manager' number to claim the prize." },
      { title: "The Trap", desc: "Manager demands you pay GST, processing fees, or taxes upfront before releasing the prize." }
    ],
    redFlags: [
      "You won a lottery you never even bought tickets for",
      "Communication via WhatsApp calls/audio from unknown numbers",
      "Demands upfront payment to release winnings"
    ],
    whatToDo: "No legitimate lottery asks for an upfront fee. Ignore and delete the message."
  },
  {
    id: "atm-skimmer",
    name: "ATM Card Skimming",
    icon: <ShieldOff className="w-5 h-5" />,
    severity: "MEDIUM",
    color: "yellow",
    trigger: `Hidden device copies card data`,
    metadata: { vector: "Physical ATMs", avgLoss: "â‚¹50,000", target: "ATM Users" },
    steps: [
      { title: "The Hook", desc: "Scammer installs a hidden magnetic skimmer inside the ATM card slot." },
      { title: "The Bait", desc: "A tiny hidden camera is placed pointing at the keypad to record your PIN." },
      { title: "The Trap", desc: "They clone your card onto a blank plastic card and withdraw cash from another location." }
    ],
    redFlags: [
      "ATM card slot looks bulky, loose, or misaligned",
      "Keypad feels unnaturally thick or spongy",
      "Unusual attachments near the top of the ATM machine"
    ],
    whatToDo: "Always wiggle the card slot before inserting, and cover the keypad with your hand while typing your PIN."
  }
];
