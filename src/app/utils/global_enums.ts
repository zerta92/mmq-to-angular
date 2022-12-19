const AppointmentType = {
    Procedure: 'Procedure',
    Consultation: 'Consultation',
}

const AppointmentTypeWithTranslation = {
    Procedure: 'GlobalEnums.Procedure',
    Consultation: 'GlobalEnums.Consultation',
}

const ServiceMessageActions = {
    NeedsAction: 0,
    ServiceDeclined: 1,
    ServiceConfirmed: 2,
    ConfirmReschedule: 3,
    ConfirmFollowUp: 4,
}

const AccountType = {
    Provider: 'Provider',
    User: 'User',
    Admin: 'Admin',
    Staff: 'Staff',
}

module.exports = {
    AppointmentType,
    AppointmentTypeWithTranslation,
    ServiceMessageActions,
    AccountType,
}
